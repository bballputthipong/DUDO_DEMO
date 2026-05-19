import { StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";
import type { WalletBalance } from "@/src/types/domain";

interface WalletSummaryProps {
  balance: WalletBalance;
}

export function WalletSummary({ balance }: WalletSummaryProps) {
  return (
    <View style={styles.card}>
      <AppText inverse style={styles.label}>
        Token Balance
      </AppText>
      <AppText inverse style={styles.total}>
        {balance.total}
      </AppText>
      <View style={styles.breakdown}>
        <BalancePill label="Personal" value={balance.personal} />
        <BalancePill label="Corporate" value={balance.corporate} />
        <BalancePill label="Bonus" value={balance.bonus} />
      </View>
    </View>
  );
}

function BalancePill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pill}>
      <AppText style={styles.pillLabel}>{label}</AppText>
      <AppText style={styles.pillValue}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy[800],
    borderRadius: radius.lg,
    gap: spacing[4],
    padding: spacing[5],
    ...shadow.md,
  },
  label: {
    color: semantic.whiteSoft,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.sm,
  },
  total: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 48,
    lineHeight: 54,
  },
  breakdown: {
    flexDirection: "row",
    gap: spacing[2],
  },
  pill: {
    backgroundColor: semantic.frostedDark,
    borderRadius: radius.full,
    flex: 1,
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  pillLabel: {
    color: semantic.whiteMuted,
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
  },
  pillValue: {
    color: semantic.textInverse,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
  },
});
