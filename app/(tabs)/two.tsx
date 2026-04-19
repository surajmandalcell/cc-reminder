import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View
        style={[
          styles.heroCard,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <Text style={[styles.title, { color: palette.text }]}>
          Cards stay light.
        </Text>
        <Text style={[styles.body, { color: palette.muted }]}>
          Only the card label, provider, last 4 digits, tags, and payment dates
          belong here. No full numbers. No expiry. No CVV.
        </Text>
      </View>

      <View
        style={[
          styles.item,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <Text style={[styles.itemTitle, { color: palette.text }]}>
          What belongs on a card
        </Text>
        <Text style={[styles.itemBody, { color: palette.muted }]}>
          Name, provider, last 4 digits, due date, billing date, notification
          preference, and optional extended tracking metadata.
        </Text>
      </View>

      <View
        style={[
          styles.item,
          { backgroundColor: palette.card, borderColor: palette.border },
        ]}
      >
        <Text style={[styles.itemTitle, { color: palette.text }]}>
          What never belongs here
        </Text>
        <Text style={[styles.itemBody, { color: palette.muted }]}>
          Full card number, CVV, expiry date, payment credentials, or
          server-synced logs.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 16,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  item: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700"heet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 28,
		gap: 16,
	},
	heroCard: {
		borderRadius: 28,
		borderWidth: 1,
		padding: 22,
		gap: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
	},
	body: {
		fontSize: 15,
		lineHeight: 22,
	},
	item: {
		borderRadius: 22,
		borderWidth: 1,
		padding: 18,
		gap: 6,
	},
	itemTitle: {
		fontSize: 16,
		fontWeight: "700",
	},
	itemBody: {
		fontSize: 14,
		lineHeight: 20,
	},
});
