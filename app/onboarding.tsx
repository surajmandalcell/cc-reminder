import { useRef, useState } from 'react';
import { router } from 'expo-router';
import type { ScrollView } from "react-native";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { useOnboarding } from "@/hooks/useOnboarding";
import { requestNotificationPermission } from '@/utils/notifications';

const slides = [
  {
    key: "open-source",
    overline: "Open source",
    title: "Built in the open so the trust model is visible.",
    body: "The app logic is meant to be inspectable. What it stores and how it behaves should never feel hidden.",
  },
  {
    key: "fully-local",
    overline: "Fully local",
    title: "Your data stays on the device you carry.",
    body: "Card labels, last 4 digits, dates, reminders, and notes remain local in v1. No backend account is required.",
  },
  {
    key: "no-logs",
    overline: "No logs",
    title: "Quiet by design, not noisy by default.",
    body: "The product starts without server logs or cloud tracking. It focuses on local reminders and your own payment memory workflow.",
  },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { completeOnboarding } = useOnboarding();
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  async function finishOnboarding() {
    await requestNotificationPermission();
    await completeOnboarding();
    router.replace("/(tabs)");
  }

  function goNext() {
    if (activeIndex === slides.length - 1) {
      void finishOnboarding();
      return;
    }

    scrollViewRef.current?.scrollTo({
      x: width * (activeIndex + 1),
      animated: true,
    });
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <View style={styles.backgroundLayer}>
        <View style={[styles.orbLarge, { backgroundColor: palette.glow }]} />
        <View style={[styles.orbSmall, { backgroundColor: palette.accent }]} />
      </View>

      <View style={styles.header}>
        <Text style={[styles.kicker, { color: palette.accent }]}>
          CC Reminder
        </Text>
        <Text style={[styles.headerBody, { color: palette.muted }]}>
          Local-first credit card memory for people who want clarity, not
          financial theater.
        </Text>
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setActiveIndex(nextIndex);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [42, 0, 42],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: "clamp",
          });

          return (
            <View key={slide.key} style={[styles.slideWrap, { width }]}>
              <Animated.View
                style={[
                  styles.slide,
                  {
                    backgroundColor: palette.card,
                    borderColor: palette.border,
                    opacity,
                    transform: [{ translateY }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: palette.border,
                      backgroundColor: palette.background,
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: palette.accent }]}>
                    {slide.overline}
                  </Text>
                </View>
                <Text style={[styles.slideTitle, { color: palette.text }]}>
                  {slide.title}
                </Text>
                <Text style={[styles.slideBody, { color: palette.muted }]}>
                  {slide.body}
                </Text>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {slides.map((slide, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 28, 10],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={slide.key}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    backgroundColor:
                      index === activeIndex ? palette.text : palette.border,
                  },
                ]}
              />
            );
          })}
        </View>

        <Pressable
          onPress={goNext}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: palette.text,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text
            style={[styles.primaryButtonText, { color: palette.background }]}
          >
            {activeIndex === slides.length - 1 ? "Enter app" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  orbLarge: {
    position: "absolute",
    top: 70,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
  },
  orbSmall: {
    position: "absolute",
    left: -50,
    bottom: 150,
    width: 160,
    height: 160,
    borderRadius: 999,
    opacity: 0.08,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
    gap: 10,
  },
  kicker: {
    fontFamily: "SpaceMono",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  headerBody: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  scrollContent: {
    flexGrow: 1,
  },
  slideWrap: {
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingVertical: 24,
  },
  slide: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 24,
    minHeight: 430,
    justifyContent: "flex-end",
    gap: 16,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 10,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: "SpaceMono",
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  slideTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
  },
  slideBody: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 18,
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
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
