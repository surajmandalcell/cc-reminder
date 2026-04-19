import { act, renderHook, waitFor } from "@testing-library/react-native";

import { CardsProvider, mapCardToDraft, useCards, validateCardDraft } from "@/hooks/useCards";
import { makeCard, makeDraft } from "@/test/factories";

jest.mock("@/utils/notifications", () => ({
	__esModule: true,
	syncReminderNotifications: jest.fn(async () => undefined),
}));

const { syncReminderNotifications: mockSyncReminderNotifications } = jest.requireMock("@/utils/notifications");

describe("useCards", () => {
	it("validates required draft fields", () => {
		expect(validateCardDraft(makeDraft({ name: "" }))).toBe("Card name is required.");
		expect(validateCardDraft(makeDraft({ provider: "" }))).toBe("Provider is required.");
		expect(validateCardDraft(makeDraft({ last4: "12" }))).toBe("Last 4 digits must be exactly four numbers.");
		expect(validateCardDraft(makeDraft({ dueDay: "" }))).toBe("Due day is required.");
		expect(
			validateCardDraft(
				makeDraft({
					extendedTrackingEnabled: true,
					extendedDate: "",
				}),
			),
		).toBe("Extended tracking needs a manual date.");
	});

	it("maps a card back into a form draft", () => {
		expect(
			mapCardToDraft(
				makeCard({
					extendedTracking: {
						manualDate: "2026-04-28",
						providerTemplateId: "amex-flex",
						acknowledgedAt: "2026-04-01T00:00:00.000Z",
						warningVersion: "v1",
						paidAmountNote: "Minimum paid",
					},
				}),
			),
		).toMatchObject({
			dueDay: "25",
			tags: "travel, daily",
			extendedTrackingEnabled: true,
			providerTemplateId: "amex-flex",
			extendedDate: "2026-04-28",
			acknowledgmentAccepted: true,
		});
	});

	it("creates, updates, acknowledges, snoozes, settles, and deletes cards", async () => {
		const { result } = renderHook(() => useCards(), { wrapper: CardsProvider });

		await waitFor(() => expect(result.current.isReady).toBe(true));

		await act(async () => {
			await result.current.createCard(makeDraft());
		});

		expect(result.current.cards).toHaveLength(1);
		const created = result.current.cards[0];

		await act(async () => {
			await result.current.updateCard(created.id, makeDraft({ name: "Updated Card" }));
		});

		expect(result.current.cards[0].name).toBe("Updated Card");

		await act(async () => {
			await result.current.acknowledgeReminder(created.id, "reminder-1");
			await result.current.snoozeReminder(created.id, "reminder-1", 6);
			await result.current.settleCycle(created.id, "cycle-1");
		});

		expect(result.current.cards[0].reminderState["reminder-1"]?.acknowledgedAt).toBeTruthy();
		expect(result.current.cards[0].reminderState["reminder-1"]?.snoozedUntil).toBeTruthy();
		expect(result.current.cards[0].paymentState["cycle-1"]?.settledAt).toBeTruthy();

		await act(async () => {
			await result.current.deleteCard(created.id);
		});

		expect(result.current.cards).toHaveLength(0);
		expect(mockSyncReminderNotifications).toHaveBeenCalled();
	});
});