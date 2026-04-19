import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { radius, spacing } from '@/constants/Tokens';

type Props = TextInputProps & {
  label: string;
  hint?: string;
  minHeight?: number;
};

export function TextField({ label, hint, minHeight, style, ...props }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            color: palette.text,
            backgroundColor: palette.cardAlt,
            borderColor: palette.border,
            minHeight,
          },
          style,
        ]}
      />
      {hint ? <Text style={[styles.hint, { color: palette.muted }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 21,
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
  },
});