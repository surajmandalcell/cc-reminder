import "@testing-library/jest-native/extend-expect";

import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import type React from "react";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native-safe-area-context", () => {
  const ReactNative = jest.requireActual("react-native");
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock"),
);

jest.mock("@/components/useColorScheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  cancelAllScheduledNotificationsAsync: jest.fn(async () => undefined),
  scheduleNotificationAsync: jest.fn(async () => "notification-id"),
  SchedulableTriggerInputTypes: {
    DATE: "date",
    TIME_INTERVAL: "timeInterval",
  },
}));

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");
  const router = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  };

  const Tabs = ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);
  Tabs.Screen = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children ?? null);

  const Stack = ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);
  Stack.Screen = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, null, children ?? null);

  return {
    router,
    Tabs,
    Stack,
    useRouter: jest.fn(() => router),
    useSegments: jest.fn(() => []),
    useLocalSearchParams: jest.fn(() => ({})),
    ErrorBoundary: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, null, children ?? null),
    Redirect: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, null, children ?? null),
    Link: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, null, children ?? null),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockAsyncStorage.clear();
});
