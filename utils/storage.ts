import AsyncStorage from "@react-native-async-storage/async-storage";

export const storageKeys = {
	onboardingComplete: "cc-reminder:onboarding-complete",
	quickNotes: "cc-reminder:quick-notes",
	cards: 'cc-reminder:cards',
} as const;

export async function loadJson<T>(key: string, fallback: T): Promise<T> {
	const raw = await AsyncStorage.getItem(key);

	if (!raw) {
		return fallback;
	}

	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
	await AsyncStorage.setItem(key, JSON.stringify(value));
}
