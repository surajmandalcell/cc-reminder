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
import { radius, spacing } from "@/constants/Tokens";
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
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<Text style={[styles.heading, { color: palette.text }]}>Notes</Text>
				<Text style={[styles.helper, { color: palette.muted }]}>
					App-level free text only. Create and delete are supported in v1.
				</Text>
			</View>

			<View
				style={[
					styles.section,
					{ backgroundColor: palette.card, borderColor: palette.border },
				]}
			>
				<TextField
					label="New note"
					value={draft}
					onChangeText={setDraft}
					placeholder="Write a reminder to your future self"
					multiline
					minHeight={120}
				/>
				<PressableScale
					onPress={() => void handleAddNote()}
					disabled={isSaving}
					contentStyle={[
						styles.button,
						{ backgroundColor: palette.cardAlt, borderColor: palette.border },
					]}
				>
					<Text style={[styles.buttonLabel, { color: palette.text }]}>
						{isSaving ? "Saving..." : "Save note"}
					</Text>
				</PressableScale>
			</View>

			{!isReady ? (
				<ActivityIndicator color={palette.text} style={{ marginTop: 24 }} />
			) : null}

			{isReady && notes.length === 0 ? (
				<View
					style={[
						styles.section,
						{ backgroundColor: palette.card, borderColor: palette.border },
					]}
				>
					<Text style={[styles.title, { color: palette.text }]}>
						No notes yet
					</Text>
				</View>
			) : null}

			{notes.map((note) => (
				<View
					key={note.id}
					style={[
						styles.section,
						{ backgroundColor: palette.card, borderColor: palette.border },
					]}
				>
					<Text style={[styles.meta, { color: palette.muted }]}>
						{formatTimestamp(note.createdAt)}
					</Text>
					<Text style={[styles.helper, { color: palette.text }]}>
						{note.body}
					</Text>
					<PressableScale
						onPress={() => void deleteNote(note.id)}
						contentStyle={[
							styles.button,
							{ backgroundColor: palette.cardAlt, borderColor: palette.border },
						]}
					>
						<Text style={[styles.buttonLabel, { color: palette.text }]}>
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
	title: {
		fontSize: 18,
		fontWeight: "600",
	},
	helper: {
		fontSize: 14,
		lineHeight: 20,
	},
	meta: {
		fontSize: 12,
		lineHeight: 18,
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
