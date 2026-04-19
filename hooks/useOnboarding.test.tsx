import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { OnboardingProvider, useOnboarding } from "@/hooks/useOnboarding";
import { storageKeys } from "@/utils/storage";

describe("useOnboarding", () => {
	it("hydrates false by default and completes onboarding", async () => {
		const { result } = renderHook(() => useOnboarding(), { wrapper: OnboardingProvider });

		await waitFor(() => expect(result.current.isReady).toBe(true));
		expect(result.current.hasCompletedOnboarding).toBe(false);

		await act(async () => {
			await result.current.completeOnboarding();
		});

		expect(result.current.hasCompletedOnboarding).toBe(true);
		expect(await AsyncStorage.getItem(storageKeys.onboardingComplete)).toBe("true");
	});

	it("hydrates existing onboarding completion", async () => {
		await AsyncStorage.setItem(storageKeys.onboardingComplete, "true");

		const { result } = renderHook(() => useOnboarding(), { wrapper: OnboardingProvider });

		await waitFor(() => expect(result.current.isReady).toBe(true));
		expect(result.current.hasCompletedOnboarding).toBe(true);
	});
});