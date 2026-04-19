import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { CardForm } from "@/components/card/CardForm";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/Tokens";
import { mapCardToDraft, useCards } from "@/hooks/useCards";
import { deriveReminders } from "@/utils/reminders";

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { cards, deleteCard, updateCard } = useCards();

  const card = cards.find((item) => item.id === id);

  if (!card) {
    return (
      <ScrollView
        style={{ backgroundColor: palette.background }}
        contentContainerStyle={styles.content}
      >
        <Stack.Screen options={{ title: "Card not found" }} />
        <View
          style={[
            styles.missing,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.missingTitle, { color: palette.text }]}>
            Card not found
          </Text>
          <Text style={[styles.missingBody, { color: palette.muted }]}>
            It may have been deleted in another screen state.
          </Text>
        </View>
      </ScrollView>
    );
  }

  const reminders = deriveReminders([card]);

  return (
    <>
      <Stack.Screen options={{ title: card.name }} />
      <CardForm
        title={card.name}
        subtitle={`Upcoming derived stages: ${reminders.length}. Edit only what belongs to the card aggregate and keep sensitive data out.`}
        initialDraft={mapCardToDraft(card)}
        submitLabel="Save changes"
        onSubmit={async (draft) => {
          const error = await updateCard(card.id, draft);
          if (!error) {
            router.back();
          }
          return error;
        }}
        onDelete={async () => {
          await deleteCard(card.id);
          router.replace("/(tabs)");
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
  },
  missing: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  missingTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  missingBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});
orderRadius: radius.xl,
		padding: spacing.xl,
		gap: spacing.sm,
	},
	missingTitle: {
		fontSize: 24,
		fontWeight: "800",
	},
	missingBody: {
		fontSize: 15,
		lineHeight: 22,
	},
});
