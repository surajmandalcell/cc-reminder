import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
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
      style={[styles.screen, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.heroCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <Text style={[styles.kicker, { color: palette.accent }]}>
          Notes for future you
        </Text>
        <Text style={[styles.title, { color: palette.text }]}>
          Keep local breadcrumbs for the next billing cycle.
        </Text>
        <Text style={[styles.body, { color: palette.muted }]}>
          Use this space for issuer quirks, payoff intentions, or anything you
          want to remember later. Everything is stored only on this device.
        </Text>
      </View>

      <View
        style={[
          styles.composerCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Example: Call Amex after minimum payment clears before trusting extended window."
          placeholderTextColor={palette.muted}
          multiline
          style={[
            styles.input,
            {
              color: palette.text,
              backgroundColor: palette.background,
              borderColor: palette.border,
            },
          ]}
        />
        <Pressable
          onPress={() => {
            void handleAddNote();
          }}
          disabled={isSaving}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: palette.text,
              opacity: pressed || isSaving ? 0.88 : 1,
            },
          ]}
        >
          <Text style={[styles.addButtonText, { color: palette.background }]}>
            {isSaving ? "Saving..." : "Save note"}
          </Text>
        </Pressable>
      </View>

      {!isReady ? (
        <ActivityIndicator color={palette.tint} style={styles.loader} />
      ) : null}

      {isReady && notes.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            No notes yet
          </Text>
          <Text style={[styles.emptyBody, { color: palette.muted }]}>
            Start with anything small that future-you would thank you for
            remembering.
          </Text>
        </View>
      ) : null}

      {notes.map((note) => (
        <View
          key={note.id}
          style={[
            styles.noteCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.noteTime, { color: palette.accent }]}>
            {formatTimestamp(note.createdAt)}
          </Text>
          <Text style={[styles.noteBody, { color: palette.text }]}>
            {note.body}
          </Text>
          <Pressable onPress={() => void deleteNote(note.id)}>
            <Text style={[styles.deleteText, { color: palette.danger }]}>
              Delete
            </Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    gap: 12,
  },
  kicker: {
    fontFamily: "SpaceMono",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  composerCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  input: {
    minHeight: 130,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    textAlignVertical: "top",
    fontSize: 15,
    lineHeight: 22,
  },
  addButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  loader: {
    marginTop: 24,
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  noteCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  noteTime: {
    fontFamily: "SpaceMono",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  noteBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
ontSize: 15,
		fontWeight: "700",
	},
	loader: {
		marginTop: 24,
	},
	emptyCard: {
		borderRadius: 24,
		borderWidth: 1,
		padding: 20,
		gap: 8,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: "700",
	},
	emptyBody: {
		fontSize: 14,
		lineHeight: 21,
	},
	noteCard: {
		borderRadius: 24,
		borderWidth: 1,
		padding: 18,
		gap: 10,
	},
	noteTime: {
		fontFamily: "SpaceMono",
		fontSize: 11,
		textTransform: "uppercase",
		letterSpacing: 0.9,
	},
	noteBody: {
		fontSize: 15,
		lineHeight: 22,
	},
	deleteText: {
		fontSize: 14,
		fontWeight: "700",
	},
});
