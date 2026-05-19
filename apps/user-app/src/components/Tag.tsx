import { StyleSheet, View, type ViewProps } from "react-native";

import { AppText } from "@/src/components/AppText";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type TagVariant = "navy" | "accent" | "neutral" | "outline-navy" | "outline-accent";

interface TagProps extends ViewProps {
  label: string;
  variant?: TagVariant;
  dot?: boolean;
}

export function Tag({ dot = false, label, style, variant = "neutral", ...props }: TagProps) {
  return (
    <View style={[styles.base, tagStyles[variant], style]} {...props}>
      {dot ? <View style={[styles.dot, dotStyles[variant]]} /> : null}
      <AppText style={[styles.text, textStyles[variant]]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.sm,
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
  },
  dot: {
    borderRadius: radius.full,
    height: 5,
    width: 5,
  },
  text: {
    fontFamily: typography.fontFamily.thaiSemibold,
    fontSize: typography.size.xs,
    letterSpacing: 0.03,
    lineHeight: typography.size.xs * typography.lineHeight.snug,
  },
});

const tagStyles = StyleSheet.create({
  navy: {
    backgroundColor: colors.navy[100],
  },
  accent: {
    backgroundColor: colors.accent[100],
  },
  neutral: {
    backgroundColor: colors.neutral[100],
  },
  "outline-navy": {
    backgroundColor: "transparent",
    borderColor: colors.navy[300],
    borderWidth: 1.5,
  },
  "outline-accent": {
    backgroundColor: "transparent",
    borderColor: colors.accent[300],
    borderWidth: 1.5,
  },
});

const textStyles = StyleSheet.create({
  navy: {
    color: colors.navy[800],
  },
  accent: {
    color: colors.accent[800],
  },
  neutral: {
    color: colors.neutral[700],
  },
  "outline-navy": {
    color: colors.navy[700],
  },
  "outline-accent": {
    color: colors.accent[700],
  },
});

const dotStyles = StyleSheet.create({
  navy: {
    backgroundColor: colors.navy[800],
  },
  accent: {
    backgroundColor: colors.accent[800],
  },
  neutral: {
    backgroundColor: colors.neutral[700],
  },
  "outline-navy": {
    backgroundColor: colors.navy[700],
  },
  "outline-accent": {
    backgroundColor: colors.accent[700],
  },
});
