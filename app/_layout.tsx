import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { OnboardingProvider, useOnboarding } from "@/hooks/useOnboarding";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  return (
    <OnboardingProvider>
      <RootLayoutContent loaded={loaded} error={error} />
    </OnboardingProvider>
  );
}

function RootLayoutContent({
  loaded,
  error,
}: {
  loaded: boolean;
  error: Error | null | undefined;
}) {
  const { isReady } = useOnboarding();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady, loaded]);

  if (!loaded || !isReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { hasCompletedOnboarding, isReady } = useOnboarding();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const inOnboarding = segments[0] === "onboarding";

    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (hasCompletedOnboarding && inOnboarding) {
      router.replace("/(tabs)");
    }
  }, [hasCompletedOnboarding, isReady, router, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal"tTheme}>
			<Stack>
				<Stack.Screen name="onboarding" options={{ headerShown: false }} />
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="modal" options={{ presentation: "modal" }} />
			</Stack>
		</ThemeProvider>
	);
}
