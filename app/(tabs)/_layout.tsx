import { Tabs } from "expo-router";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: palette.text,
				tabBarInactiveTintColor: palette.muted,
				tabBarStyle: {
					backgroundColor: palette.card,
					borderTopColor: palette.border,
				},
				headerShown: useClientOnlyValue(false, true),
			}}
		>
			<Tabs.Screen name="index" options={{ title: "Reminders" }} />
			<Tabs.Screen name="two" options={{ title: "Cards" }} />
			<Tabs.Screen name="notes" options={{ title: "Notes" }} />
		</Tabs>
	);
}
