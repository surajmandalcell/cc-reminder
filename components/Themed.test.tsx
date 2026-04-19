import { render, screen } from "@testing-library/react-native";

import { Text, View, useThemeColor } from "@/components/Themed";

describe("Themed components", () => {
	it("prefers explicit light colors over theme defaults", () => {
		expect(useThemeColor({ light: "#123456" }, "text")).toBe("#123456");
	});

	it("renders themed text and view wrappers", () => {
		render(
			<View testID="wrapper">
				<Text lightColor="#222222">Hello world</Text>
			</View>,
		);

		expect(screen.getByText("Hello world")).toHaveStyle({ color: "#222222" });
		expect(screen.getByTestId("wrapper")).toHaveStyle({ backgroundColor: "#ffffff" });
	});
});