import { Check } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/src/components/AppText";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "frosted";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  success?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  disabled = false,
  fullWidth = false,
  loading = false,
  size = "md",
  style,
  success = false,
  title,
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const textColor = isDisabled
    ? semantic.textDisabled
    : variant === "secondary" || variant === "ghost" || variant === "frosted"
      ? semantic.textBrand
      : semantic.textInverse;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.full,
        success && styles.success,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={textColor} size="small" /> : null}
      {success && !loading ? <Check color={textColor} size={18} strokeWidth={2} /> : null}
      <AppText style={[styles.label, { color: textColor }]}>{title}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing[2],
    justifyContent: "center",
  },
  full: {
    width: "100%",
  },
  label: {
    fontFamily: typography.fontFamily.thaiSemibold,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  success: {
    backgroundColor: colors.accent[400],
  },
  disabled: {
    backgroundColor: colors.neutral[200],
    borderColor: colors.neutral[200],
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  md: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  lg: {
    paddingHorizontal: spacing[8],
    paddingVertical: 14,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: semantic.textBrand,
    ...shadow.sm,
  },
  secondary: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderDefault,
    borderWidth: 1.5,
    ...shadow.xs,
  },
  ghost: {
    backgroundColor: semantic.transparent,
  },
  accent: {
    backgroundColor: colors.accent[400],
    ...shadow.sm,
  },
  frosted: {
    backgroundColor: semantic.frostedWhite,
    borderColor: semantic.frostedWhiteBorder,
    borderWidth: 1,
    ...shadow.sm,
  },
});
