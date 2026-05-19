import { Pressable, StyleSheet, type PressableProps } from "react-native";

import { AppText } from "@/src/components/AppText";
import { colors, radius, semantic, spacing, typography } from "@/src/theme/tokens";

interface PillSelectProps extends Omit<PressableProps, "style"> {
  label: string;
  selected?: boolean;
  tone?: "navy" | "accent";
}

export function PillSelect({ disabled = false, label, selected = false, tone = "navy", ...props }: PillSelectProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        selected ? selectedStyles[tone] : styles.default,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      {...props}
    >
      <AppText style={[styles.label, selected ? selectedTextStyles[tone] : styles.defaultText]}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  default: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderDefault,
  },
  defaultText: {
    color: semantic.textSecondary,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: typography.fontFamily.thaiMedium,
    fontSize: typography.size.sm,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});

const selectedStyles = StyleSheet.create({
  navy: {
    backgroundColor: colors.navy[700],
    borderColor: colors.navy[700],
  },
  accent: {
    backgroundColor: colors.accent[50],
    borderColor: colors.accent[300],
  },
});

const selectedTextStyles = StyleSheet.create({
  navy: {
    color: semantic.textInverse,
  },
  accent: {
    color: colors.accent[700],
  },
});
