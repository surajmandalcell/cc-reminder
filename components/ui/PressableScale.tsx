import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { motion } from '@/constants/Tokens';

type Props = Omit<PressableProps, 'children'> & {
  children?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  haptic?: boolean;
};

export function PressableScale({ children, contentStyle, haptic = true, onPress, disabled, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  function animate(toValue: number) {
    Animated.timing(scale, {
      toValue,
      duration: motion.fast,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={() => animate(0.975)}
      onPressOut={() => animate(1)}
      onPress={(event) => {
        if (haptic && !disabled) {
          void Haptics.selectionAsync();
        }
        onPress?.(event);
      }}>
      <Animated.View style={[contentStyle, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}