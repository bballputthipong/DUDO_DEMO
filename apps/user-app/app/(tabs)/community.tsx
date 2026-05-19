import { MessageCircle, Trophy, UsersRound } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { Screen } from "@/src/components/Screen";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

const communityItems = [
  {
    title: "Movement circle",
    description: "Join nearby members for weekly studio sessions.",
    icon: <UsersRound color={colors.navy[700]} size={22} />,
  },
  {
    title: "Challenge board",
    description: "Track streaks and share progress with your team.",
    icon: <Trophy color={colors.accent[500]} size={22} />,
  },
  {
    title: "Wellness notes",
    description: "Read short reviews before booking a new place.",
    icon: <MessageCircle color={colors.navy[700]} size={22} />,
  },
];

export default function CommunityScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Community</AppText>
        <AppText muted>Connect with members, challenges, and shared wellness activity.</AppText>
      </View>

      <View style={styles.list}>
        {communityItems.map((item) => (
          <View key={item.title} style={styles.card}>
            <View style={styles.iconWrap}>{item.icon}</View>
            <View style={styles.copy}>
              <AppText style={styles.title}>{item.title}</AppText>
              <AppText muted style={styles.description}>
                {item.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  list: {
    gap: spacing[3],
  },
  card: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing[3],
    padding: spacing[4],
    ...shadow.sm,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: semantic.bgNavySubtle,
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  copy: {
    flex: 1,
    gap: spacing[1],
  },
  title: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
  },
  description: {
    fontSize: typography.size.sm,
  },
});
