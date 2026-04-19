import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { TextField } from "@/components/ui/TextField";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, shadow, spacing } from "@/constants/Tokens";
import { useQuickNotes } from "@/hooks/useQuickNotes";

function formatTimestamp(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(value));
}

export default function NotesScreen() {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];
	const { notes, isReady, addNote, deleteNote } = useQuickNotes();
	const [draft, setDraft] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	async function handleAddNote() {
		setIsSaving(true);
		const saved = await addNote(draft);
		if (saved) {
			setDraft("");
		}
		setIsSaving(false);
	}

	return (
		<ScrollView
			style={{ backgroundColor: palette.background }}
			contentContainerStyle={styles.content}
		>
			<View
				style={[
					styles.hero,
					shadow.medium,
					{
						backgroundColor: palette.card,
						borderColor: palette.border,
						shadowColor: palette.glow,
					},
				]}
			>
				<Text style={[styles.kicker, { color: palette.accent }]}>
					Future-self notes
				</Text>
				<Text style={[styles.title, { color: palette.text }]}>
					Keep memory crumbs that do not belong in the card model.
				</Text>
				<Text style={[styles.body, { color: palette.muted }]}>
					Use this space for support call follow-ups, temporary payoff plans, or
					issuer quirks you want visible without polluting structured payment
					data.
				</Text>
			</View>

			<View
				style={[
					styles.composer,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<TextField
					label="New note"
					value={draft}
					onChangeText={setDraft}
					placeholder="Example: If support confirms a manual extension, save the exact date here too."
					multiline
					minHeight={120}
				/>
				<PressableScale
					onPress={() => void handleAddNote()}
					disabled={isSaving}
					contentStyle={[
						styles.saveButton,
						{ backgroundColor: palette.text, opacity: isSaving ? 0.72 : 1 },
					]}
				>
					<Text style={[styles.saveLabel, { color: palette.background }]}>
						{isSaving ? "Saving..." : "Save note"}
					</Text>
				</PressableScale>
			</View>

			{!isReady ? (
				<ActivityIndicator color={palette.tint} style={{ marginTop: 24 }} />
			) : null}

			{isReady && notes.length === 0 ? (
				<View
					style={[
						styles.empty,
						{ backgroundColor: palette.card, borderColor: palette.border },
					]}
				>
					<Text style={[styles.emptyTitle, { color: palette.text }]}>
						No notes yet
					</Text>
					<Text style={[styles.emptyBody, { color: palette.muted }]}>
						Start with something small that future-you will thank you for
						remembering during the next billing cycle.
					</Text>
				</View>
			) : null}

			{notes.map((note) => (
				<View
					key={note.id}
					style={[
						styles.note,
						shadow.soft,
						{
							backgroundColor: palette.card,
							borderColor: palette.border,
							shadowColor: palette.glow,
						},
					]}
				>
					<Text style={[styles.noteTime, { color: palette.accent }]}>
						{formatTimestamp(note.createdAt)}
					</Text>
					<Text style={[styles.noteBody, { color: palette.text }]}>
						{note.body}
					</Text>
					<PressableScale
						onPress={() => void deleteNote(note.id)}
						contentStyle={[
							styles.deleteButton,
							{ backgroundColor: palette.cardAlt, borderColor: palette.border },
						]}
					>
						<Text style={[styles.deleteLabel, { color: palette.danger }]}>
							Delete
						</Text>
					</PressableScale>
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		padding: spacing.lg,
		gap: spacing.md,
	},
	hero: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.xl,
		gap: spacing.sm,
	},
	kicker: {
		fontFamily: "SpaceMono",
		fontSize: 12,
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	title: {
		fontSize: 28,
		lineHeight: 34,
		fontWeight: "800",
	},
	body: {
		fontSize: 15,
		lineHeight: 22,
	},
	composer: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.lg,
		gap: spacing.md,
	},
	saveButton: {
		borderRadius: radius.md,
		paddingVertical: 14,
		alignItems: "center",
	},
	saveLabel: {
		fontSize: 15,
		fontWeight: "800",
	},
	empty: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.xl,
		gap: spacing.sm,
	},
	emptyTitle: {
		fontSize: 22,
		fontWeight: "800",
	},
	emptyBody: {
		fontSize: 15,
		lineHeight: 22,
	},
	note: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.lg,
		gap: spacing.sm,
	},
	noteTime: {
		fontFamily: "SpaceMono",
		fontSize: 11,
		textTransform: "uppercase",
	},
	noteBody: {
		fontSize: 15,
		lineHeight: 23,
	},
	deleteButton: {
		alignSelf: "flex-start",
		borderWidth: 1,
		borderRadius: radius.md,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	deleteLabel: {
		fontSize: 13,
		fontWeight: "800",
	},
});
