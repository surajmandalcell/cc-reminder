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
					A local-first reminder tool for billing checkpoints, due dates, and
					manual follow-up windows.
				</Text>
				<View style={styles.list}>
					<Text style={[styles.listItem, { color: palette.text }]}>
						1. Card data stays on-device.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						2. Open source: the logic is visible.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						3. Fully local in v1: no backend storage.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						4. No logs in v1: no backend event trail.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						5. Only last 4 digits are stored.
					</Text>
					<Text style={[styles.listItem, { color: palette.text }]}>
						6. Extended dates are memory aids, not guarantees.
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
		borderWidth: 2,
		borderRadius: radius.sm,
		padding: spacing.lg,
		gap: spacing.md,
	},
	title: {
		fontFamily: "SpaceMono",
		fontSize: 24,
		lineHeight: 32,
		textTransform: "uppercase",
	},
	body: {
		fontFamily: "SpaceMono",
		fontSize: 14,
		lineHeight: 22,
	},
	list: {
		gap: 8,
	},
	listItem: {
		fontFamily: "SpaceMono",
		fontSize: 13,
		lineHeight: 21,
	},
	note: {
		fontFamily: "SpaceMono",
		fontSize: 13,
		lineHeight: 20,
	},
	button: {
		borderWidth: 2,
		borderRadius: radius.sm,
		paddingVertical: 14,
		alignItems: "center",
	},
	buttonLabel: {
		fontFamily: "SpaceMono",
		fontSize: 14,
		lineHeight: 20,
		textTransform: "uppercase",
	},
});
