import { router } from "expo-route"react";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PressableScale } from "@/components/ui/PressableScale";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, shadow, spacing } from "@/constants/Tokens";
import { useCards } from "@/hooks/useCards";
import { formatFullDate, relativeDayLabel } from "@/utils/date";
import { deriveReminders, getReminderMetrics } from "@/utils/reminders";

const filters = [
  { key: "all", label: "All" },
  { key: "overdue", label: "Overdue" },
  { key: "extended", label: "Extended" },
] as const;

export default function RemindersScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { cards, acknowledgeReminder, settleCycle, snoozeReminder } =
    useCards();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const reminders = useMemo(() => deriveReminders(cards), [cards]);
  const metrics = useMemo(
    () => getReminderMetrics(cards, reminders),
    [cards, reminders],
  );

  const visibleReminders = reminders.filter((reminder) => {
    if (filter === "overdue") return reminder.stage === "overdue";
    if (filter === "extended") return reminder.stage === "extended";
    return true;
  });

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
          Reminder cockpit
        </Text>
        <Text style={[styles.heroTitle, { color: palette.text }]}>
          Stage-based reminders that keep the pressure precise.
        </Text>
        <Text style={[styles.heroBody, { color: palette.muted }]}>
          Billing is acknowledged, due dates get progressively sharper nudges,
          and overdue or extended windows stay visible until settlement.
        </Text>

        <View style={styles.metricRow}>
          {[
            { label: "Cards", value: metrics.cardCount },
            { label: "Active", value: metrics.activeCount },
            { label: "Overdue", value: metrics.overdueCount },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                styles.metric,
                {
                  backgroundColor: palette.cardAlt,
                  borderColor: palette.border,
                },
              ]}
            >
              <Text style={[styles.metricValue, { color: palette.text }]}>
                {item.value}
              </Text>
              <Text style={[styles.metricLabel, { color: palette.muted }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((option) => (
          <PressableScale
            key={option.key}
            onPress={() => setFilter(option.key)}
            contentStyle={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === option.key ? palette.text : palette.card,
                borderColor:
                  filter === option.key ? palette.text : palette.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterLabel,
                {
                  color:
                    filter === option.key ? palette.background : palette.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </PressableScale>
        ))}
      </View>

      {visibleReminders.length === 0 ? (
        <View
          style={[
            styles.empty,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: palette.text }]}>
            Nothing is asking for attention.
          </Text>
          <Text style={[styles.emptyBody, { color: palette.muted }]}>
            Add a card and the reminder engine will derive billing, due soon,
            due today, overdue, and optional extended stages.
          </Text>
          <PressableScale
            onPress={() => router.push("/card/new" as never)}
            contentStyle={[styles.cta, { backgroundColor: palette.text }]}
          >
            <Text style={[styles.ctaLabel, { color: palette.background }]}>
              Create your first card
            </Text>
          </PressableScale>
        </View>
      ) : null}

      {visibleReminders.map((reminder) => {
        const toneColor =
          reminder.tone === "danger"
            ? palette.danger
            : reminder.tone === "warning"
              ? palette.warning
              : reminder.tone === "success"
                ? palette.success
                : reminder.tone === "accent"
                  ? palette.tint
                  : palette.accent;

        return (
          <View
            key={reminder.id}
            style={[
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
              <View
                style={[
                  styles.stageBadge,
                  {
                    backgroundColor: palette.cardAlt,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.stageBadgeText, { color: toneColor }]}>
                  {reminder.stage.replace(/-/g, " ")}
                </Text>
              </View>
              <Text style={[styles.relativeLabel, { color: toneColor }]}>
                {relativeDayLabel(reminder.scheduledFor)}
              </Text>
            </View>

            <PressableScale
              onPress={() => router.push(`/card/${reminder.cardId}` as never)}
              contentStyle={styles.touchBlock}
            >
              <Text style={[styles.cardTitle, { color: palette.text }]}>
                {reminder.title}
              </Text>
              <Text style={[styles.cardBody, { color: palette.muted }]}>
                {reminder.subtitle}
              </Text>
              <Text style={[styles.meta, { color: palette.muted }]}>
                {reminder.cardName} · {formatFullDate(reminder.dueDate)}
              </Text>
            </PressableScale>

            <View style={styles.actionRow}>
              <PressableScale
                onPress={() =>
                  void acknowledgeReminder(reminder.cardId, reminder.id)
                }
                contentStyle={[
                  styles.actionButton,
                  {
                    backgroundColor: palette.cardAlt,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.actionLabel, { color: palette.text }]}>
                  {reminder.isAcknowledged ? "Seen" : "Acknowledge"}
                </Text>
              </PressableScale>
              <PressableScale
                onPress={() =>
                  void snoozeReminder(reminder.cardId, reminder.id, 12)
                }
                contentStyle={[
                  styles.actionButton,
                  {
                    backgroundColor: palette.cardAlt,
                    borderColor: palette.border,
                  },
                ]}
              >
                <Text style={[styles.actionLabel, { color: palette.text }]}>
                  Snooze 12h
                </Text>
              </PressableScale>
              <PressableScale
                onPress={() =>
                  void settleCycle(reminder.cardId, reminder.cycleId)
                }
                contentStyle={[
                  styles.settleButton,
                  { backgroundColor: palette.text },
                ]}
              >
                <Text
                  style={[styles.settleLabel, { color: palette.background }]}
                >
                  {reminder.isSettled ? "Settled" : "Settle"}
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
  hero: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  kicker: {
    fontFamily: "SpaceMono",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
  },
  heroBody: {
    fontSize: 15,
    lineHeight: 23,
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  metricLabel: {
    fontSize: 13,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  empty: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  cta: {
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: "700",
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
    alignItems: "center",
  },
  stageBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stageBadgeText: {
    fontFamily: "SpaceMono",
    fontSize: 11,
    textTransform: "uppercase",
  },
  relativeLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  touchBlock: {
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  meta: {
    fontSize: 12,
    fontFamily: "SpaceMono",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  settleButton: {
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  settleLabel: {
    fontSize: 13,
    fontWeight: "800"ercase",
		letterSpacing: 1,
	},
	heroTitle: {
		fontSize: 30,
		lineHeight: 36,
		fontWeight: "800",
	},
	heroBody: {
		fontSize: 15,
		lineHeight: 23,
	},
	metricRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	metric: {
		flex: 1,
		borderWidth: 1,
		borderRadius: radius.lg,
		padding: spacing.md,
		gap: 4,
	},
	metricValue: {
		fontSize: 22,
		fontWeight: "800",
	},
	metricLabel: {
		fontSize: 13,
	},
	filterRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	filterChip: {
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	filterLabel: {
		fontSize: 13,
		fontWeight: "700",
	},
	empty: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.xl,
		gap: spacing.md,
	},
	emptyTitle: {
		fontSize: 24,
		fontWeight: "700",
	},
	emptyBody: {
		fontSize: 15,
		lineHeight: 22,
	},
	cta: {
		borderRadius: radius.md,
		paddingVertical: 14,
		alignItems: "center",
	},
	ctaLabel: {
		fontSize: 15,
		fontWeight: "700",
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
		alignItems: "center",
	},
	stageBadge: {
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	stageBadgeText: {
		fontFamily: "SpaceMono",
		fontSize: 11,
		textTransform: "uppercase",
	},
	relativeLabel: {
		fontSize: 13,
		fontWeight: "700",
	},
	touchBlock: {
		gap: 6,
	},
	cardTitle: {
		fontSize: 20,
		lineHeight: 25,
		fontWeight: "700",
	},
	cardBody: {
		fontSize: 14,
		lineHeight: 21,
	},
	meta: {
		fontSize: 12,
		fontFamily: "SpaceMono",
	},
	actionRow: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: 4,
	},
	actionButton: {
		flex: 1,
		borderWidth: 1,
		borderRadius: radius.md,
		paddingVertical: 12,
		alignItems: "center",
	},
	actionLabel: {
		fontSize: 13,
		fontWeight: "700",
	},
	settleButton: {
		borderRadius: radius.md,
		paddingVertical: 12,
		paddingHorizontal: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	settleLabel: {
		fontSize: 13,
		fontWeight: "800",
	},
});
