import { makeCard } from "@/test/factories";
import { formatDateKey } from "@/utils/date";
import { deriveReminders, getReminderMetrics } from "@/utils/reminders";

describe("reminder derivation", () => {
	it("derives the expected stages for an active card lifecycle", () => {
		const now = new Date(2026, 3, 20);
		const reminders = deriveReminders([makeCard({ billingDay: 18 })], now);
		const stages = reminders.map((item) => item.stage);

		expect(stages).toEqual(
			expect.arrayContaining([
				"billing",
				"due-soon-7",
				"due-soon-3",
				"due-soon-1",
				"due-today",
				"overdue",
			]),
		);
	});

	it("derives day-before and day-of extended reminders", () => {
		const now = new Date(2026, 3, 20);
		const reminders = deriveReminders(
			[
				makeCard({
					extendedTracking: {
						manualDate: "2026-04-22",
						acknowledgedAt: "2026-04-01T00:00:00.000Z",
						warningVersion: "v1",
					},
				}),
			],
			now,
		);

		const extended = reminders.filter((item) => item.stage === "extended");

		expect(extended).toHaveLength(2);
		expect(extended.map((item) => item.title)).toEqual(
			expect.arrayContaining([
				"Everyday Gold extended date tomorrow",
				"Everyday Gold extended follow-up",
			]),
		);
	});

	it("drops overdue reminders for settled cycles while keeping future stages", () => {
		const now = new Date(2026, 3, 20);
		const cycleId = `card-1:${formatDateKey(new Date(2026, 2, 25))}`;
		const reminders = deriveReminders(
			[
				makeCard({
					paymentState: {
						[cycleId]: {
							settledAt: "2026-04-20T09:00:00.000Z",
						},
					},
				}),
			],
			now,
		);

		expect(reminders.some((item) => item.stage === "overdue")).toBe(false);
		expect(reminders.some((item) => item.stage === "due-soon-3")).toBe(true);
	});

	it("hides snoozed reminders until the snooze time passes", () => {
		const now = new Date(2026, 3, 20);
		const snoozedReminderId = `card-1:${formatDateKey(new Date(2026, 3, 25))}:due-soon-3:${formatDateKey(new Date(2026, 3, 22))}`;
		const reminders = deriveReminders(
			[
				makeCard({
					reminderState: {
						[snoozedReminderId]: {
							snoozedUntil: "2026-04-25T00:00:00.000Z",
						},
					},
				}),
			],
			now,
		);

		expect(reminders.some((item) => item.id === snoozedReminderId)).toBe(false);
	});

	it("returns summary metrics for active reminders", () => {
		const now = new Date(2026, 3, 20);
		const cards = [makeCard()];
		const reminders = deriveReminders(cards, now);

		expect(getReminderMetrics(cards, reminders)).toMatchObject({
			cardCount: 1,
			activeCount: reminders.length,
			overdueCount: 1,
		});
	});
});