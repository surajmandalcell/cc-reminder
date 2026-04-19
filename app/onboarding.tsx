import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { OpenGLHero } from "@/components/onboarding/OpenGLHero";
import { PressableScale } from "@/components/ui/PressableScale";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { radius, shadow, spacing } from "@/constants/Tokens";
import { useOnboarding } from "@/hooks/useOnboarding";
import { requestNotificationPermission } from "@/utils/notifications";

const slides = [
	{
		key: "open-source",
		overline: "Open source",
		title: "The trust surface is visible, not hidden behind product fog.",
		body: "The domain model and reminder logic stay inspectable so you can verify what the app stores and what it refuses to store.",
		bullets: [
			"Transparent product direction",
			"No fake bank integration theatre",
			"Domain rules can evolve in the open",
		],
	},
	{
		key: "fully-local",
		overline: "Fully local",
		title: "Your card timeline stays on the device in your hand.",
		body: "Card labels, last 4 digits, due dates, reminder state, tags, notes, and optional extended tracking all live locally in v1.",
		bullets: [
			"No account required",
			"No cloud sync dependency",
			"Fast local-first interactions",
		],
	},
	{
		key: "no-logs",
		overline: "No logs",
		title: "Quiet by default, but still sharp where it matters.",
		body: "The app focuses on stage-based reminders and intentional follow-up without sending your usage trail to a backend.",
		bullets: [
			"No server-side usage logs",
			"Notifications are local",
			"Extended tracking stays explicit and user-managed",
		],
	},
] as const;

export default function OnboardingScreen() {
	const colorScheme = useColorScheme() ?? "light";
	const palette = Colors[colorScheme];
	const { completeOnboarding } = useOnboarding();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isFinishing, setIsFinishing] = useState(false);
	const reveal = useSharedValue(1);

	function animatePanel() {
		reveal.value = 0;
		reveal.value = withTiming(1, {
			duration: 420,
			easing: Easing.out(Easing.cubic),
		});
	}

	async function finishOnboarding() {
		if (isFinishing) {
			return;
		}

		setIsFinishing(true);
		await requestNotificationPermission();
		await completeOnboarding();
		router.replace("/(tabs)");
	}

	function goNext() {
		if (activeIndex === slides.length - 1) {
			void finishOnboarding();
			return;
		}

		animatePanel();
		setActiveIndex((current) => current + 1);
	}

	function goBack() {
		animatePanel();
		setActiveIndex((current) => Math.max(0, current - 1));
	}

	const slide = slides[activeIndex];
	const cardStyle = useAnimatedStyle(() => ({
		opacity: reveal.value,
		transform: [{ translateY: (1 - reveal.value) * 18 }],
	}));

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: palette.background }]}
		>
			<View style={styles.backdrop}>
				<View
					style={[styles.backdropOrbOne, { backgroundColor: palette.glow }]}
				/>
				<View
					style={[styles.backdropOrbTwo, { backgroundColor: palette.hero }]}
				/>
			</View>

			<View style={styles.header}>
				<View>
					<Text style={[styles.brand, { color: palette.accent }]}>
						CC Reminder
					</Text>
					<Text style={[styles.headerTitle, { color: palette.text }]}>
						Local-first credit card memory with a premium surface.
					</Text>
				</View>
				<Text style={[styles.headerBody, { color: palette.muted }]}>
					What follows is the product trust contract: open source, fully local,
					and log-free in v1.
				</Text>
			</View>

			<OpenGLHero palette={palette} phase={activeIndex} />

			<Animated.View
				key={slide.key}
				entering={FadeIn.duration(280)}
				exiting={FadeOut.duration(180)}
				style={[styles.panelWrap, cardStyle]}
			>
				<View
					style={[
						styles.panel,
						shadow.medium,
						{
							backgroundColor: palette.card,
							borderColor: palette.border,
							shadowColor: palette.glow,
						},
					]}
				>
					<View style={styles.panelTop}>
						<View
							style={[
								styles.badge,
								{
									backgroundColor: palette.cardAlt,
									borderColor: palette.border,
								},
							]}
						>
							<Text style={[styles.badgeText, { color: palette.accent }]}>
								{slide.overline}
							</Text>
						</View>
						<Text style={[styles.counter, { color: palette.muted }]}>
							0{activeIndex + 1} / 0{slides.length}
						</Text>
					</View>

					<Text style={[styles.panelTitle, { color: palette.text }]}>
						{slide.title}
					</Text>
					<Text style={[styles.panelBody, { color: palette.muted }]}>
						{slide.body}
					</Text>

					<View style={styles.bulletList}>
						{slide.bullets.map((item) => (
							<View key={item} style={styles.bulletRow}>
								<View
									style={[styles.bulletIcon, { backgroundColor: palette.text }]}
								>
									<FontAwesome
										name="check"
										size={11}
										color={palette.background}
									/>
								</View>
								<Text style={[styles.bulletText, { color: palette.text }]}>
									{item}
								</Text>
							</View>
						))}
					</View>
				</View>
			</Animated.View>

			<View style={styles.footer}>
				<View style={styles.dotsRow}>
					{slides.map((item, index) => (
						<View
							key={item.key}
							style={[
								styles.dot,
								{
									width: index === activeIndex ? 28 : 10,
									backgroundColor:
										index === activeIndex ? palette.text : palette.border,
								},
							]}
						/>
					))}
				</View>

				<View style={styles.actions}>
					<PressableScale
						onPress={goBack}
						disabled={activeIndex === 0 || isFinishing}
						contentStyle={[
							styles.secondaryButton,
							{
								backgroundColor: palette.card,
								borderColor: palette.border,
								opacity: activeIndex === 0 || isFinishing ? 0.45 : 1,
							},
						]}
					>
						<Text style={[styles.secondaryButtonText, { color: palette.text }]}>
							Back
						</Text>
					</PressableScale>

					<PressableScale
						onPress={goNext}
						disabled={isFinishing}
						contentStyle={[
							styles.primaryButton,
							{
								backgroundColor: palette.text,
								opacity: isFinishing ? 0.72 : 1,
							},
						]}
					>
						<Text
							style={[styles.primaryButtonText, { color: palette.background }]}
						>
							{activeIndex === slides.length - 1
								? isFinishing
									? "Entering..."
									: "Enter app"
								: "Continue"}
						</Text>
					</PressableScale>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
		gap: spacing.lg,
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
	},
	backdropOrbOne: {
		position: "absolute",
		width: 240,
		height: 240,
		borderRadius: 999,
		top: 24,
		right: -34,
	},
	backdropOrbTwo: {
		position: "absolute",
		width: 220,
		height: 220,
		borderRadius: 999,
		bottom: 110,
		left: -50,
		opacity: 0.58,
	},
	header: {
		gap: spacing.sm,
	},
	brand: {
		fontFamily: "SpaceMono",
		fontSize: 12,
		textTransform: "uppercase",
		letterSpacing: 1.2,
	},
	headerTitle: {
		marginTop: 6,
		fontSize: 32,
		lineHeight: 38,
		fontWeight: "800",
		maxWidth: 320,
	},
	headerBody: {
		fontSize: 15,
		lineHeight: 22,
		maxWidth: 340,
	},
	panelWrap: {
		flex: 1,
	},
	panel: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 26,
		padding: spacing.xl,
		gap: spacing.md,
	},
	panelTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	badge: {
		borderWidth: 1,
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 7,
	},
	badgeText: {
		fontFamily: "SpaceMono",
		fontSize: 11,
		letterSpacing: 0.8,
		textTransform: "uppercase",
	},
	counter: {
		fontFamily: "SpaceMono",
		fontSize: 12,
	},
	panelTitle: {
		fontSize: 30,
		lineHeight: 36,
		fontWeight: "800",
	},
	panelBody: {
		fontSize: 16,
		lineHeight: 24,
	},
	bulletList: {
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	bulletRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	bulletIcon: {
		width: 24,
		height: 24,
		borderRadius: 999,
		justifyContent: "center",
		alignItems: "center",
	},
	bulletText: {
		flex: 1,
		fontSize: 14,
		lineHeight: 21,
		fontWeight: "600",
	},
	footer: {
		gap: spacing.md,
	},
	dotsRow: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
	},
	dot: {
		height: 10,
		borderRadius: 999,
	},
	actions: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	secondaryButton: {
		flex: 1,
		borderWidth: 1,
		borderRadius: radius.lg,
		paddingVertical: 16,
		alignItems: "center",
	},
	secondaryButtonText: {
		fontSize: 15,
		fontWeight: "700",
	},
	primaryButton: {
		flex: 1.4,
		borderRadius: radius.lg,
		paddingVertical: 16,
		alignItems: "center",
	},
	primaryButtonText: {
		fontSize: 15,
		fontWeight: "800",
	},
});
