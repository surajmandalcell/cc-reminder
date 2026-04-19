import { useMemo, useState } from "react";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { TextField } from "@/components/ui/TextField";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, spacing } from "@/constants/Tokens";
import { useCards } from "@/hooks/useCards";
import { formatFullDate, getNextOccurrence } from "@/utils/date";
import { deriveReminders } from "@/utils/reminders";

export default function CardsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { cards, tagPool } = useCards();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return [...cards]
      .filter((card) => {
        const matchesSearch =
          !searchTerm ||
          [card.name, card.provider, card.last4, ...card.tags]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm);
        const matchesTag = !selectedTag || card.tags.includes(selectedTag);

        return matchesSearch && matchesTag;
      })
      .sort((left, right) => {
        const leftDue = getNextOccurrence(left.dueDay).getTime();
        const rightDue = getNextOccurrence(right.dueDay).getTime();
        if (leftDue !== rightDue) {
          return leftDue - rightDue;
        }
        return left.name.localeCompare(right.name);
      });
  }, [cards, search, selectedTag]);

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
        <Text style={[styles.heading, { color: palette.text }]}>Cards</Text>
        <Text style={[styles.helper, { color: palette.muted }]}> 
          Sorted by nearest due date first. Search works across card name,
          provider, last 4, and tags.
        </Text>
      </View>

      <TextField
        label="Search cards"
        value={search}
        onChangeText={setSearch}
        placeholder="Search by card name, provider, last 4, or tag"
      />

      {tagPool.length > 0 ? (
        <View style={styles.tagRow}>
          <PressableScale
            onPress={() => setSelectedTag(null)}
            contentStyle={[
              styles.tagButton,
              { backgroundColor: palette.cardAlt, borderColor: palette.border },
            ]}
          >
            <Text style={[styles.tagLabel, { color: palette.text }]}>All tags</Text>
          </PressableScale>
          {tagPool.map((tag) => (
            <PressableScale
              key={tag}
              onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}
              contentStyle={[
                styles.tagButton,
                {
                  backgroundColor: palette.cardAlt,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.tagLabel, { color: palette.text }]}>{tag}</Text>
            </PressableScale>
          ))}
        </View>
      ) : null}

      <PressableScale
        onPress={() => router.push("/card/new" as never)}
        contentStyle={[
          styles.button,
          { backgroundColor: palette.cardAlt, borderColor: palette.border },
        ]}
      >
        <Text style={[styles.buttonLabel, { color: palette.text }]}>Add card</Text>
      </PressableScale>

      {filteredCards.length === 0 ? (
        <View
          style={[
            styles.section,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.title, { color: palette.text }]}>No cards found</Text>
          <Text style={[styles.helper, { color: palette.muted }]}> 
            Create a card or change the current search and tag filter.
          </Text>
        </View>
      ) : null}

      {filteredCards.map((card) => {
        const reminders = deriveReminders([card]);
        const nextReminder = reminders[0];

        return (
          <PressableScale
            key={card.id}
            onPress={() => router.push(`/card/${card.id}` as never)}
            contentStyle={[
              styles.section,
              { backgroundColor: palette.card, borderColor: palette.border },
            ]}
          >
            <Text style={[styles.title, { color: palette.text }]}>{card.name}</Text>
            <Text style={[styles.meta, { color: palette.text }]}> 
              {card.provider} · last 4 {card.last4}
            </Text>
            <Text style={[styles.meta, { color: palette.text }]}> 
              Due day {card.dueDay}
              {card.billingDay ? ` · Billing day ${card.billingDay}` : ""}
            </Text>
            <Text style={[styles.helper, { color: palette.muted }]}> 
              Notifications: {card.notificationsEnabled ? "on" : "off"}
            </Text>
            <Text style={[styles.helper, { color: palette.muted }]}> 
              {nextReminder
                ? `Next reminder: ${nextReminder.title} · ${formatFullDate(nextReminder.scheduledFor)}`
                : "No active reminders right now."}
            </Text>
            {card.tags.length > 0 ? (
              <Text style={[styles.helper, { color: palette.muted }]}>Tags: {card.tags.join(", ")}</Text>
            ) : null}
          </PressableScale>
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
  helper: {
    fontSize: 13,
    lineHeight: 19,
  },
  tagRow: {
    gap: 8,
  },
  tagButton: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
