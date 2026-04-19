import type { ReactNode } from "react";
import type { PressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";

type Props = Omit<PressableProps, "children" | "style"> & {
  children?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  haptic?: boolean;
};

export function PressableScale({
  children,
  contentStyle,
  disabled,
  ...rest
}: Props) {
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        disabled ? styles.disabled : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={contentStyle}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
