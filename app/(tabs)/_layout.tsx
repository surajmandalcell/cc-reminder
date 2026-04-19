import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
	name: ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={24} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: palette.tint,
				tabBarInactiveTintColor: palette.tabIconDefault,
				tabBarStyle: {
					height: 76,
					paddingTop: 10,
					paddingBottom: 12,
					backgroundColor: palette.card,
					borderTopColor: palette.border,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "700",
				},
				headerShown: useClientOnlyValue(false, true),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Reminders",
					tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
					headerRight: () => (
						<Link href="/modal" asChild>
							<Pressable>
								{({ pressed }) => (
									<FontAwesome
										name="info-circle"
										size={22}
										color={palette.text}
										style={{ marginRight: 18, opacity: pressed ? 0.6 : 1 }}
									/>
								)}
							</Pressable>
						</Link>
					),
				}}
			/>
			<Tabs.Screen
				name="two"
				options={{
					title: "Cards",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="credit-card" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="notes"
				options={{
					title: "Notes",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="sticky-note-o" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
