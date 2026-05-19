import { router } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80" }}
      style={styles.root}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.brandMark}>
          <AppText style={styles.brandText}>DUDO</AppText>
        </View>
        <View style={styles.copy}>
          <AppText inverse style={styles.title}>
            Wellness Token
          </AppText>
          <AppText inverse style={styles.subtitle}>
            Use your tokens to book wellness classes for body and mind
          </AppText>
        </View>
        <View style={styles.actions}>
          <Button fullWidth size="lg" title="Sign In" onPress={() => router.push("/auth/login")} />
          <Button fullWidth size="lg" title="Sign Up" variant="frosted" onPress={() => router.push("/auth/signup")} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.overlayStrong,
  },
  content: {
    gap: spacing[8],
    padding: spacing[5],
    paddingBottom: spacing[10],
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: semantic.frostedWhite,
    borderRadius: radius.lg,
    height: 64,
    justifyContent: "center",
    width: 96,
    ...shadow.md,
  },
  brandText: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  copy: {
    gap: spacing[3],
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["3xl"],
    lineHeight: typography.size["3xl"] * typography.lineHeight.tight,
  },
  subtitle: {
    color: semantic.whiteSoft,
    fontSize: typography.size.md,
    lineHeight: typography.size.md * typography.lineHeight.base,
  },
  actions: {
    gap: spacing[3],
  },
});
