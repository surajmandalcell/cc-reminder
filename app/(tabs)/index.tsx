import { router } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/Tokens";
import { useCards } from "@/hooks/useCards";
import { formatFullDate, relativeDayLabel } from "@/utils/date";
import { deriveReminders, getReminderMetrics } from "@/utils/reminders";

export default function RemindersScreen() {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];
	const { cards, acknowledgeReminder, settleCycle, snoozeReminder } =
		useCards();

	const reminders = useMemo(() => deriveReminders(cards), [cards]);
	const metrics = useMemo(
		() => getReminderMetrics(cards, reminders),
		[cards, reminders],
	);

	return (
		<ScrollView
			style={{ backgroundColor: palette.background }}
			contentContainerStyle={styles.content}
		>
			<View
				style={[
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<Text style={[styles.heading, { color: palette.text }]}>Reminders</Text>
				<Text style={[styles.summary, { color: palette.text }]}>
					Cards: {metrics.cardCount} · Active reminders: {metrics.activeCount} ·
					Overdue: {metrics.overdueCount}
				</Text>
				<Text style={[styles.helper, { color: palette.muted }]}>
					One flat list. Overdue reminders stay active until the current cycle
					is settled.
				</Text>
				<Text style={[styles.helper, { color: palette.muted }]}>
					Device notification permission is optional. In-app reminders keep
					working either way.
				</Text>
			</View>

			{cards.length === 0 ? (
				<View
					style={[
						styles.section,
						{ backgroundColor: palette.card, borderColor: palette.border },
					]}
				>
					<Text style={[styles.emptyTitle, { color: palette.text }]}>
						No cards yet
					</Text>
					<Text style={[styles.helper, { color: palette.muted }]}>
						Add a card first. The reminder stages are derived from the card
						schedule.
					</Text>
					<PressableScale
						onPress={() => router.push("/card/new" as never)}
						contentStyle={[
							styles.button,
							{ backgroundColor: palette.cardAlt, borderColor: palette.border },
						]}
					>
						<Text style={[styles.buttonLabel, { color: palette.text }]}>
							Add card
						</Text>
					</PressableScale>
				</View>
			) : null}

			{reminders.length === 0 && cards.length > 0 ? (
				<View
					style={[
						styles.section,
						{ backgroundColor: palette.card, borderColor: palette.border },
					]}
				>
					<Text style={[styles.emptyTitle, { color: palette.text }]}>
						Nothing active right now
					</Text>
					<Text style={[styles.helper, { color: palette.muted }]}>
						Upcoming billing, due-soon, due-today, overdue, and extended
						reminders will appear here automatically.
					</Text>
				</View>
			) : null}

			{reminders.map((reminder) => {
				const toneColor =
					reminder.tone === "danger"
						? palette.danger
						: reminder.tone === "warning"
							? palette.warning
							: reminder.tone === "success"
								? palette.success
								: palette.text;

				return (
					<View
						key={reminder.id}
						style={[
							styles.section,
							{ backgroundColor: palette.card, borderColor: palette.border },
						]}
					>
						<Text style={[styles.stage, { color: toneColor }]}>
							{reminder.stage}
						</Text>
						<Text style={[styles.title, { color: palette.text }]}>
							{reminder.title}
						</Text>
						<Text style={[styles.meta, { color: palette.text }]}>
							{reminder.cardName} · {formatFullDate(reminder.dueDate)} ·{" "}
							{relativeDayLabel(reminder.scheduledFor)}
						</Text>
						<Text style={[styles.helper, { color: palette.muted }]}>
							{reminder.subtitle}
						</Text>
						<Text style={[styles.helper, { color: palette.muted }]}>
							Acknowledged: {reminder.isAcknowledged ? "yes" : "no"} · Settled:{" "}
							{reminder.isSettled ? "yes" : "no"}
						</Text>
						<View style={styles.actions}>
							<PressableScale
								onPress={() =>
									void acknowledgeReminder(reminder.cardId, reminder.id)
								}
								contentStyle={[
									styles.button,
									{
										backgroundColor: palette.cardAlt,
										borderColor: palette.border,
									},
								]}
							>
								<Text style={[styles.buttonLabel, { color: palette.text }]}>
									{reminder.isAcknowledged ? "Acknowledged" : "Acknowledge"}
								</Text>
							</PressableScale>
							<PressableScale
								onPress={() =>
									void snoozeReminder(reminder.cardId, reminder.id, 12)
								}
								contentStyle={[
									styles.button,
									{
										backgroundColor: palette.cardAlt,
										borderColor: palette.border,
									},
								]}
							>
								<Text style={[styles.buttonLabel, { color: palette.text }]}>
									Snooze 12h
								</Text>
							</PressableScale>
							<PressableScale
								onPress={() =>
									void settleCycle(reminder.cardId, reminder.cycleId)
								}
								contentStyle={[
									styles.button,
									{
										backgroundColor: palette.cardAlt,
										borderColor: palette.border,
									},
								]}
							>
								<Text style={[styles.buttonLabel, { color: palette.text }]}>
									{reminder.isSettled ? "Settled" : "Settle cycle"}
								</Text>
							</PressableScale>
							<PressableScale
								onPress={() => router.push(`/card/${reminder.cardId}` as never)}
								contentStyle={[
									styles.button,
									{
										backgroundColor: palette.cardAlt,
										borderColor: palette.border,
									},
								]}
							>
								<Text style={[styles.buttonLabel, { color: palette.text }]}>
									Open card
								</Text>
							</PressableScale>
						</View>
					</View>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		padding: spacing.lg,
		gap: spacing.md,
	},
	section: {
		borderWidth: 1,
		borderRadius: radius.sm,
		padding: spacing.md,
		gap: 8,
	},
	heading: {
		fontSize: 20,
		fontWeight: "700",
	},
	summary: {
		fontSize: 14,
		lineHeight: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
	},
	stage: {
		fontSize: 12,
		fontWeight: "700",
		textTransform: "uppercase",
	},
	meta: {
		fontSize: 13,
		lineHeight: 19,
	},
	helper: {
		fontSize: 13,
		lineHeight: 19,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
	actions: {
		gap: 8,
	},
	button: {
		borderWidth: 1,
		borderRadius: radius.sm,
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	buttonLabel: {
		fontSize: 14,
		fontWeight: "600",
	},
});
