import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function TabOneScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
            shadowColor: palette.glow,
          },
        ]}
      >
        <Text style={[styles.eyebrow, { color: palette.accent }]}>
          Local reminder engine
        </Text>
        <Text style={[styles.title, { color: palette.text }]}>
          Payment stages, not noisy custom reminders.
        </Text>
        <Text style={[styles.body, { color: palette.muted }]}>
          The app will derive reminders from billing, due, overdue, and optional
          extended windows so the flow stays consistent per card.
        </Text>
      </View>

      <View style={styles.list}>
        <View
          style={[
            styles.stageCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.stageTitle, { color: palette.text }]}>
            Billing
          </Text>
          <Text style={[styles.stageBody, { color: palette.muted }]}>
            Acknowledge the statement checkpoint on the billing date.
          </Text>
        </View>
        <View
          style={[
            styles.stageCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.stageTitle, { color: palette.text }]}>
            Due Soon
          </Text>
          <Text style={[styles.stageBody, { color: palette.muted }]}>
            Default nudges land 7, 3, and 1 day before the due date.
          </Text>
        </View>
        <View
          style={[
            styles.stageCard,
            { backgroundColor: palette.card, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.stageTitle, { color: palette.text }]}>
            Overdue
          </Text>
          <Text style={[styles.stageBody, { color: palette.muted }]}>
            This stage stays active until you mark the payment settled.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 18,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    gap: 12,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 7,
  },
  eyebrow: {
    fontFamily: "SpaceMono",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
  },
  list: {
    gap: 14,
  },
  stageCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "700"
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 28,
		gap: 18,
	},
	heroCard: {
		borderRadius: 28,
		borderWidth: 1,
		padding: 24,
		gap: 12,
		shadowOffset: { width: 0, height: 18 },
		shadowOpacity: 0.18,
		shadowRadius: 30,
		elevation: 7,
	},
	eyebrow: {
		fontFamily: "SpaceMono",
		fontSize: 12,
		textTransform: "uppercase",
		letterSpacing: 1.1,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		lineHeight: 34,
	},
	body: {
		fontSize: 15,
		lineHeight: 23,
	},
	list: {
		gap: 14,
	},
	stageCard: {
		borderRadius: 22,
		borderWidth: 1,
		padding: 18,
		gap: 6,
	},
	stageTitle: {
		fontSize: 18,
		fontWeight: "700",
	},
	stageBody: {
		fontSize: 14,
		lineHeight: 21,
	},
});
