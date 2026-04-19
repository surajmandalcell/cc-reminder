import { render, screen } from "@testing-library/react-native";

import CardDetailScreen from "@/app/card/[id]";
import { makeCard, makeDraft } from "@/test/factories";

const mockUseCards = jest.fn();
const mockDeriveReminders = jest.fn();
let capturedProps: any;

jest.mock("@/hooks/useCards", () => ({
	...jest.requireActual("@/hooks/useCards"),
	useCards: () => mockUseCards(),
}));

jest.mock("@/utils/reminders", () => ({
	deriveReminders: (...args: unknown[]) => mockDeriveReminders(...args),
}));

jest.mock("@/components/card/CardForm", () => ({
	CardForm: (props: unknown) => {
		capturedProps = props;
		return null;
	},
}));

describe("CardDetailScreen", () => {
	it("shows a missing-card state when the route id does not exist", () => {
		const expoRouter = jest.requireMock("expo-router");
		expoRouter.useLocalSearchParams.mockReturnValue({ id: "missing" });
		mockUseCards.mockReturnValue({ cards: [], deleteCard: jest.fn(), updateCard: jest.fn() });

		render(<CardDetailScreen />);
		expect(screen.getByText("Card not found")).toBeOnTheScreen();
	});

	it("configures edit and delete flows for an existing card", async () => {
		const mockUpdateCard = jest.fn(async () => null);
		const mockDeleteCard = jest.fn(async () => undefined);
		const card = makeCard();
		const expoRouter = jest.requireMock("expo-router");

		expoRouter.useLocalSearchParams.mockReturnValue({ id: card.id });
		mockUseCards.mockReturnValue({
			cards: [card],
			deleteCard: mockDeleteCard,
			updateCard: mockUpdateCard,
		});
		mockDeriveReminders.mockReturnValue([{ id: "r1" }, { id: "r2" }]);

		render(<CardDetailScreen />);
		const { router } = expoRouter;

		expect(capturedProps.title).toBe(card.name);
		expect(capturedProps.submitLabel).toBe("Save changes");
		expect(capturedProps.initialDraft).toMatchObject(makeDraft());

		await capturedProps.onSubmit(makeDraft({ name: "Updated" }));
		expect(mockUpdateCard).toHaveBeenCalledWith(card.id, makeDraft({ name: "Updated" }));
		expect(router.back).toHaveBeenCalled();

		await capturedProps.onDelete();
		expect(mockDeleteCard).toHaveBeenCalledWith(card.id);
		expect(router.replace).toHaveBeenCalledWith("/(tabs)");
	});
});