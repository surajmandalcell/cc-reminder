import { render, screen } from "@testing-library/react-native";

import NotFoundScreen from "@/app/+not-found";

describe("NotFoundScreen", () => {
	it("renders the fallback message and recovery link", () => {
		render(<NotFoundScreen />);

		expect(screen.getByText("This screen doesn't exist.")).toBeOnTheScreen();
		expect(screen.getByText("Go to home screen!")).toBeOnTheScreen();
	});
});