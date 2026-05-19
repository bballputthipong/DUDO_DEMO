import { TextInput, View, StyleSheet, type TextInputProps } from "react-native";

import { AppText } from "@/src/components/AppText";
import { radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}

export function InputField({ error, hint, label, style, ...props }: InputFieldProps) {
  const message = error ?? hint;
  const hasError = error !== undefined && error.length > 0;

  return (
    <View style={styles.field}>
      <AppText style={styles.label}>{label}</AppText>
      <TextInput
        placeholderTextColor={semantic.textTertiary}
        style={[styles.input, hasError ? styles.inputError : null, style]}
        {...props}
      />
      {message ? <AppText style={[styles.message, hasError ? styles.error : null]}>{message}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing[1],
  },
  label: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.thaiMedium,
    fontSize: typography.size.sm,
  },
  input: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderDefault,
    borderRadius: radius.md,
    borderWidth: 1.5,
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.thai,
    fontSize: typography.size.base,
    padding: spacing[3],
    ...shadow.xs,
  },
  inputError: {
    borderColor: semantic.borderError,
  },
  message: {
    color: semantic.textSecondary,
    fontFamily: typography.fontFamily.thai,
    fontSize: typography.size.xs,
  },
  error: {
    color: semantic.borderError,
  },
});
