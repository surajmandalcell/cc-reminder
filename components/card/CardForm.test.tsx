import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { CardForm } from "@/components/card/CardForm";
import { makeDraft } from "@/test/factories";

describe("CardForm", () => {
	it("submits sanitized card values", async () => {
		const onSubmit = jest.fn(async () => null);

		render(
			<CardForm
				title="Create a card"
				subtitle="Capture card reminder data"
				initialDraft={makeDraft()}
				submitLabel="Save card"
				onSubmit={onSubmit}
			/>,
		);

		fireEvent.changeText(screen.getByPlaceholderText("Example: Everyday Gold"), "Blue Cash");
		fireEvent.changeText(screen.getByPlaceholderText("American Express"), "Amex");
		fireEvent.changeText(screen.getByPlaceholderText("0123"), "12a34");
		fireEvent.changeText(screen.getAllByPlaceholderText("1-31")[0], "33");
		fireEvent.changeText(screen.getAllByPlaceholderText("1-31")[1], "31");
		fireEvent.changeText(screen.getByPlaceholderText("travel, backup, monthly"), "travel, backup");

		fireEvent.press(screen.getByText("Save card"));

		await waitFor(() => expect(onSubmit).toHaveBeenCalled());
		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "Blue Cash",
				provider: "Amex",
				last4: "1234",
				billingDay: "33",
				dueDay: "31",
				tags: "travel, backup",
			}),
		);
	});

	it("reveals extended tracking fields and applies the provider template", () => {
		render(
			<CardForm
				title="Create a card"
				subtitle="Capture card reminder data"
				initialDraft={makeDraft()}
				submitLabel="Save card"
				onSubmit={jest.fn(async () => null)}
			/>,
		);

		fireEvent.press(screen.getByText("Extended tracking: off"));

		expect(screen.getByText("Provider template")).toBeOnTheScreen();
		expect(screen.getByText("Extended tracking")).toBeOnTheScreen();

		fireEvent.press(screen.getByText("Use American Express template"));

		expect(screen.getByText("Using American Express template")).toBeOnTheScreen();
		expect(screen.getByText("Amex reference template")).toBeOnTheScreen();
	});

	it("renders submit errors and delete affordance", async () => {
		const onDelete = jest.fn(async () => undefined);

		render(
			<CardForm
				title="Edit card"
				subtitle="Update card details"
				initialDraft={makeDraft()}
				submitLabel="Save changes"
				onSubmit={jest.fn(async () => "Due day is required.")}
				onDelete={onDelete}
			/>,
		);

		fireEvent.press(screen.getByText("Save changes"));
		await screen.findByText("Due day is required.");

		fireEvent.press(screen.getByText("Delete card"));
		await waitFor(() => expect(onDelete).toHaveBeenCalled());
	});
});