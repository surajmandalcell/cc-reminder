import { render } from "@testing-library/react-native";

import NewCardScreen from "@/app/card/new";
import { makeDraft } from "@/test/factories";

const mockCreateCard = jest.fn();
const mockDefaultDraft = jest.fn(() => makeDraft());
let capturedProps: any;

jest.mock("@/hooks/useCards", () => ({
	useCards: () => ({
		createCard: mockCreateCard,
		defaultDraft: mockDefaultDraft,
	}),
}));

jest.mock("@/components/card/CardForm", () => ({
	CardForm: (props: unknown) => {
		capturedProps = props;
		return null;
	},
}));

describe("NewCardScreen", () => {
	it("configures the card form and routes back on successful save", async () => {
		render(<NewCardScreen />);
		const { router } = jest.requireMock("expo-router");

		expect(capturedProps.submitLabel).toBe("Save card");
		expect(capturedProps.initialDraft).toEqual(makeDraft());

		mockCreateCard.mockResolvedValueOnce(null);
		await capturedProps.onSubmit(makeDraft());

		expect(mockCreateCard).toHaveBeenCalledWith(makeDraft());
		expect(router.back).toHaveBeenCalled();
	});
});