import { router } from "expo-route"react";

import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PressableScale } from "@/components/ui/PressableScale";
import { TextField } from "@/components/ui/TextField";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, shadow, spacing } from "@/constants/Tokens";
import { useCards } from "@/hooks/useCards";
import { formatFullDate } from "@/utils/date";
import { deriveReminders } from "@/utils/reminders";

export default function CardsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { cards, tagPool } = useCards();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSearch =
        !searchTerm ||
        [card.name, card.provider, card.last4, ...card.tags]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);
      const matchesTag = !selectedTag || card.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [cards, search, selectedTag]);

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
          Card ledger
        </Text>
        <Text style={[styles.title, { color: palette.text }]}>
          Cards stay minimal, but the surface should still feel premium.
        </Text>
        <Text style={[styles.body, { color: palette.muted }]}>
          Track providers, last 4 digits, due dates, tags, reminder settings,
          and optional extended follow-up without ever storing payment
          credentials.
        </Text>
      </View>

      <TextField
        label="Search cards"
        value={search}
        onChangeText={setSearch}
        placeholder="Search by card, provider, tag, or last 4"
      />

      {tagPool.length > 0 ? (
        <View style={styles.tagRow}>
          <PressableScale
            onPress={() => setSelectedTag(null)}
            contentStyle={[
              styles.tagChip,
              {
                backgroundColor: selectedTag ? palette.card : palette.text,
                borderColor: selectedTag ? palette.border : palette.text,
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: selectedTag ? palette.text : palette.background },
              ]}
            >
              All tags
            </Text>
          </PressableScale>
          {tagPool.map((tag) => (
            <PressableScale
              key={tag}
              onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}
              contentStyle={[
                styles.tagChip,
                {
                  backgroundColor:
                    selectedTag === tag ? palette.text : palette.card,
                  borderColor:
                    selectedTag === tag ? palette.text : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  {
                    color:
                      selectedTag === tag ? palette.background : palette.text,
                  },
                ]}
              >
                {tag}
              </Text>
            </PressableScale>
          ))}
        </View>
      ) : null}

      <PressableScale
        onPress={() => router.push("/card/new" as never)}
        contentStyle={[styles.createButton, { backgroundColor: palette.text }]}
      >
        <Text style={[styles.createLabel, { color: palette.background }]}>
          Add card
        </Text>
      </PressableScale>

      {filteredCards.map((card) => {
        const reminders = deriveReminders([card]);
        const nextReminder = reminders[0];

        return (
          <PressableScale
            key={card.id}
            onPress={() => router.push(`/card/${card.id}` as never)}
            contentStyle={[
              styles.card,
              shadow.soft,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
                shadowColor: palette.glow,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={[styles.cardTitle, { color: palette.text }]}>
                  {card.name}
                </Text>
                <Text style={[styles.cardMeta, { color: palette.muted }]}>
                  {card.provider} · •••• {card.last4}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: palette.cardAlt,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.statusText, { color: palette.accent }]}>
                  {card.notificationsEnabled ? "Alerts on" : "Alerts off"}
                </Text>
              </View>
            </View>

            <Text style={[styles.dateLine, { color: palette.text }]}>
              Due day {card.dueDay}
              {card.billingDay ? ` · Billing day ${card.billingDay}` : ""}
            </Text>
            <Text style={[styles.helper, { color: palette.muted }]}>
              {nextReminder
                ? `Next stage: ${nextReminder.title} · ${formatFullDate(nextReminder.scheduledFor)}`
                : "No active reminder stages yet."}
            </Text>

            {card.tags.length > 0 ? (
              <View style={styles.tagsWrap}>
                {card.tags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tagPill,
                      {
                        backgroundColor: palette.cardAlt,
                        borderColor: palette.border,
                      },
                    ]}
                  >
                    <Text style={[styles.tagPillText, { color: palette.text }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </PressableScale>
        );
      })}

      {filteredCards.length === 0 ? (
        <View
          style={[
            styles.empty,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            No cards yet
          </Text>
          <Text style={[styles.emptyBody, { color: palette.muted }]}>
            Start by adding a card with provider, last 4 digits, and due date.
            That becomes the source for every stage-based reminder.
          </Text>
        </View>
      ) : null}
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
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tagChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "700",
  },
  createButton: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  createLabel: {
    fontSize: 15,
    fontWeight: "800",
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  cardMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dateLine: {
    fontSize: 15,
    fontWeight: "700",
  },
  helper: {
    fontSize: 14,
    lineHeight: 21,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: "700",
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
});

	tagText: {
		fontSize: 13,
		fontWeight: "700",
	},
	createButton: {
		borderRadius: radius.md,
		paddingVertical: 14,
		alignItems: "center",
	},
	createLabel: {
		fontSize: 15,
		fontWeight: "800",
	},
	card: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.lg,
		gap: spacing.sm,
	},
	cardTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.sm,
		alignItems: "flex-start",
	},
	cardTitle: {
		fontSize: 20,
		fontWeight: "800",
	},
	cardMeta: {
		fontSize: 13,
		marginTop: 2,
	},
	statusPill: {
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	statusText: {
		fontSize: 12,
		fontWeight: "700",
	},
	dateLine: {
		fontSize: 15,
		fontWeight: "700",
	},
	helper: {
		fontSize: 14,
		lineHeight: 21,
	},
	tagsWrap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
	},
	tagPill: {
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	tagPillText: {
		fontSize: 12,
		fontWeight: "700",
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
});
