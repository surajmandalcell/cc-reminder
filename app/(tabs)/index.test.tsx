import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import RemindersScreen from "@/app/(tabs)/index";
import type { DerivedReminder } from "@/types/domain";

const mockUseCards = jest.fn();
const mockDeriveReminders = jest.fn();
const mockGetReminderMetrics = jest.fn();

jest.mock("@/hooks/useCards", () => ({
	useCards: () => mockUseCards(),
}));

jest.mock("@/utils/reminders", () => ({
	deriveReminders: (...args: unknown[]) => mockDeriveReminders(...args),
	getReminderMetrics: (...args: unknown[]) => mockGetReminderMetrics(...args),
}));

describe("RemindersScreen", () => {
	it("shows the empty state and routes to new card creation", () => {
		mockUseCards.mockReturnValue({
			cards: [],
			acknowledgeReminder: jest.fn(),
			settleCycle: jest.fn(),
			snoozeReminder: jest.fn(),
		});
		mockDeriveReminders.mockReturnValue([]);
		mockGetReminderMetrics.mockReturnValue({ cardCount: 0, activeCount: 0, overdueCount: 0 });

		render(<RemindersScreen />);
		const { router } = jest.requireMock("expo-router");

		expect(screen.getByText("No cards yet")).toBeOnTheScreen();
		fireEvent.press(screen.getByText("Add card"));
		expect(router.push).toHaveBeenCalledWith("/card/new");
	});

	it("wires reminder actions and navigation", async () => {
		const mockAcknowledgeReminder = jest.fn(async () => undefined);
		const mockSnoozeReminder = jest.fn(async () => undefined);
		const mockSettleCycle = jest.fn(async () => undefined);
		const reminder: DerivedReminder = {
			id: "reminder-1",
			cycleId: "cycle-1",
			cardId: "card-1",
			cardName: "Everyday Gold",
			provider: "American Express",
			stage: "overdue",
			title: "Everyday Gold is overdue",
			subtitle: "Due Apr 15, 2026",
			scheduledFor: "2026-04-20T00:00:00.000Z",
			dueDate: "2026-04-15T00:00:00.000Z",
			tone: "danger",
			isAcknowledged: false,
			isSettled: false,
		};

		mockUseCards.mockReturnValue({
			cards: [{ id: "card-1" }],
			acknowledgeReminder: mockAcknowledgeReminder,
			settleCycle: mockSettleCycle,
			snoozeReminder: mockSnoozeReminder,
		});
		mockDeriveReminders.mockReturnValue([reminder]);
		mockGetReminderMetrics.mockReturnValue({ cardCount: 1, activeCount: 1, overdueCount: 1 });

		render(<RemindersScreen />);
		const { router } = jest.requireMock("expo-router");

		fireEvent.press(screen.getByText("Acknowledge"));
		fireEvent.press(screen.getByText("Snooze 12h"));
		fireEvent.press(screen.getByText("Settle cycle"));
		fireEvent.press(screen.getByText("Open card"));

		await waitFor(() => expect(mockAcknowledgeReminder).toHaveBeenCalledWith("card-1", "reminder-1"));
		expect(mockSnoozeReminder).toHaveBeenCalledWith("card-1", "reminder-1", 12);
		expect(mockSettleCycle).toHaveBeenCalledWith("card-1", "cycle-1");
		expect(router.push).toHaveBeenCalledWith("/card/card-1");
	});
});