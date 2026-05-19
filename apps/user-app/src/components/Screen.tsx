import { type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { webPhoneShell } from "@/src/theme/layout";
import { semantic, spacing } from "@/src/theme/tokens";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({ children, contentStyle, padded = true, scroll = true, style }: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safe, webPhoneShell, style]}>
        <ScrollView contentContainerStyle={[styles.scrollContent, padded && styles.padded, contentStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, webPhoneShell, padded && styles.padded, style]}>
      <View style={[styles.flex, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: semantic.bgApp,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[16] + spacing[10],
  },
  padded: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
  },
});
