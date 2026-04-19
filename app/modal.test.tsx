import { render, screen } from "@testing-library/react-native";

import ModalScreen from "@/app/modal";

describe("ModalScreen", () => {
	it("renders the trust and product explanation sections", () => {
		render(<ModalScreen />);

		expect(screen.getByText("About CC Reminder")).toBeOnTheScreen();
		expect(screen.getByText("Trust Boundary")).toBeOnTheScreen();
		expect(screen.getByText("What It Never Stores")).toBeOnTheScreen();
		expect(screen.getByText("Provider Templates")).toBeOnTheScreen();
		expect(screen.getByText("Reminder Model")).toBeOnTheScreen();
	});
});