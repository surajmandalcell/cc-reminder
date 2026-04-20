import { fireEvent, render, screen } from "@testing-library/react-native";

import CardsScreen from "@/app/(tabs)/two";
import { makeCard } from "@/test/factories";

const mockUseCards = jest.fn();
const mockDeriveReminders = jest.fn();

jest.mock("@/hooks/useCards", () => ({
	useCards: () => mockUseCards(),
}));

jest.mock("@/utils/reminders", () => ({
	deriveReminders: (...args: unknown[]) => mockDeriveReminders(...args),
}));

describe("CardsScreen", () => {
	it("filters cards by search and tag, then routes to create and detail screens", () => {
		mockUseCards.mockReturnValue({
			cards: [
				makeCard(),
				makeCard({ id: "card-2", name: "Blue Cash", provider: "Amex", last4: "9999", tags: ["backup"] }),
			],
			tagPool: ["backup", "daily", "travel"],
		});
		mockDeriveReminders.mockReturnValue([{ title: "Due soon", scheduledFor: "2026-04-25T00:00:00.000Z" }]);

		render(<CardsScreen />);
		const { router } = jest.requireMock("expo-router");

		expect(screen.getByText("Everyday Gold")).toBeOnTheScreen();
		expect(screen.getByText("Blue Cash")).toBeOnTheScreen();

		fireEvent.changeText(screen.getByPlaceholderText("Search by card name, provider, last 4, or tag"), "9999");
		expect(screen.queryByText("Everyday Gold")).toBeNull();
		expect(screen.getByText("Blue Cash")).toBeOnTheScreen();

		fireEvent.changeText(screen.getByPlaceholderText("Search by card name, provider, last 4, or tag"), "");
		fireEvent.press(screen.getByText("backup"));
		expect(screen.queryByText("Everyday Gold")).toBeNull();
		expect(screen.getByText("Blue Cash")).toBeOnTheScreen();

		fireEvent.press(screen.getByText("Add card"));
		expect(router.push).toHaveBeenCalledWith("/card/new");

		fireEvent.press(screen.getByText("Blue Cash"));
		expect(router.push).toHaveBeenCalledWith("/card/card-2");
	});

	it("shows the empty state when no cards match the filters", () => {
		mockUseCards.mockReturnValue({
			cards: [],
			tagPool: [],
		});
		mockDeriveReminders.mockReturnValue([]);

		render(<CardsScreen />);
		expect(screen.getByText("No cards found")).toBeOnTheScreen();
	});
});