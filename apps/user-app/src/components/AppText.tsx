import { Text, type StyleProp, type TextProps, type TextStyle } from "react-native";

import { semantic, textStyles, type TextVariant } from "@/src/theme/tokens";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  muted?: boolean;
  inverse?: boolean;
  style?: StyleProp<TextStyle>;
}

export function AppText({ inverse = false, muted = false, style, variant = "body", ...props }: AppTextProps) {
  return (
    <Text
      style={[
        textStyles[variant],
        muted && { color: semantic.textSecondary },
        inverse && { color: semantic.textInverse },
        style,
      ]}
      {...props}
    />
  );
}
