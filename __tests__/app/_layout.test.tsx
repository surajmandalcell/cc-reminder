import { render } from "@testing-library/react-native";

const mockUseOnboarding = jest.fn();
const mockUseFonts = jest.fn();
const mockHideAsync = jest.fn(async () => undefined);

jest.mock("@expo/vector-icons/FontAwesome", () => ({
	__esModule: true,
	default: { font: {} },
}));

jest.mock("expo-font", () => ({
	useFonts: () => mockUseFonts(),
}));

jest.mock("expo-splash-screen", () => ({
	preventAutoHideAsync: jest.fn(),
	hideAsync: () => mockHideAsync(),
}));

jest.mock("@/hooks/useOnboarding", () => ({
	OnboardingProvider: ({ children }: { children: React.ReactNode }) => children,
	useOnboarding: () => mockUseOnboarding(),
}));

jest.mock("@/hooks/useCards", () => ({
	CardsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const RootLayout = require("@/app/_layout").default;

describe("RootLayout", () => {
	it("redirects first-time users into onboarding", () => {
		const expoRouter = jest.requireMock("expo-router");

		mockUseFonts.mockReturnValue([true, null]);
		mockUseOnboarding.mockReturnValue({
			isReady: true,
			hasCompletedOnboarding: false,
		});
		expoRouter.useSegments.mockReturnValue([]);

		render(<RootLayout />);

		expect(expoRouter.router.replace).toHaveBeenCalledWith("/onboarding");
		expect(mockHideAsync).toHaveBeenCalled();
	});

	it("redirects completed users away from onboarding", () => {
		const expoRouter = jest.requireMock("expo-router");

		mockUseFonts.mockReturnValue([true, null]);
		mockUseOnboarding.mockReturnValue({
			isReady: true,
			hasCompletedOnboarding: true,
		});
		expoRouter.useSegments.mockReturnValue(["onboarding"]);

		render(<RootLayout />);

		expect(expoRouter.router.replace).toHaveBeenCalledWith("/(tabs)");
	});
});