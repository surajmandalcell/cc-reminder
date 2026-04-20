import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import OnboardingScreen from "@/app/onboarding";

const mockCompleteOnboarding = jest.fn(async () => undefined);
const mockRequestNotificationPermission = jest.fn(async () => undefined);

jest.mock("@/hooks/useOnboarding", () => ({
	useOnboarding: () => ({
		completeOnboarding: mockCompleteOnboarding,
	}),
}));

jest.mock("@/utils/notifications", () => ({
	requestNotificationPermission: () => mockRequestNotificationPermission(),
}));

describe("OnboardingScreen", () => {
	it("shows trust copy and continues into the app", async () => {
		render(<OnboardingScreen />);
		const { router } = jest.requireMock("expo-router");

		expect(screen.getByText("CC Reminder")).toBeOnTheScreen();
		expect(screen.getByText("1. Card data stays on-device.")).toBeOnTheScreen();

		fireEvent.press(screen.getByText("Continue"));

		await waitFor(() => expect(mockRequestNotificationPermission).toHaveBeenCalled());
		await waitFor(() => expect(mockCompleteOnboarding).toHaveBeenCalled());
		await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/(tabs)"));
	});
});