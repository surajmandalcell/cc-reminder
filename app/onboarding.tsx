import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale } from "@/components/ui/PressableScale";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/Tokens";
import { useOnboarding } from "@/hooks/useOnboarding";
import { requestNotificationPermission } from "@/utils/notifications";

export default function OnboardingScreen() {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];
	const { completeOnboarding } = useOnboarding();
	const [isContinuing, setIsContinuing] = useState(false);

	async function handleContinue() {
		if (isContinuing) {
			return;
		}

		setIsContinuing(true);
		await requestNotificationPermission();
		await completeOnboarding();
		router.replace("/(tabs)");
	}

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: palette.background }]}
		>
			<View
				style={[
					styles.panel,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<Text style={[styles.title, { color: palette.text }]}>CC Reminder</Text>
				<Text style={[styles.body, { color: palette.text }]}>
					This app is open source, fully local in v1, and keeps no logs in v1.
				</Text>
				<View style={styles.list}>
					<Text style={[styles.listItem, { color: palette.text }]}>
						1. Card data stays on-device.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						2. Only last 4 digits are stored.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						3. Extended dates are memory aids, not guarantees.
					</Text>
				</View>
				<Text style={[styles.note, { color: palette.muted }]}>
					If device notification permission is denied, in-app reminders still
					work.
				</Text>
				<PressableScale
					onPress={() => void handleContinue()}
					disabled={isContinuing}
					contentStyle={[
						styles.button,
						{ backgroundColor: palette.cardAlt, borderColor: palette.border },
					]}
				>
					<Text style={[styles.buttonLabel, { color: palette.text }]}>
						{isContinuing ? "Continuing..." : "Continue"}
					</Text>
				</PressableScale>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		padding: spacing.lg,
		justifyContent: "center",
	},
	panel: {
		borderWidth: 1,
		borderRadius: radius.sm,
		padding: spacing.lg,
		gap: spacing.md,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
	},
	body: {
		fontSize: 16,
		lineHeight: 23,
	},
	list: {
		gap: 8,
	},
	listItem: {
		fontSize: 15,
		lineHeight: 22,
	},
	note: {
		fontSize: 13,
		lineHeight: 18,
	},
	button: {
		borderWidth: 1,
		borderRadius: radius.sm,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonLabel: {
		fontSize: 15,
		fontWeight: "600",
	},
});
