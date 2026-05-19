import { StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { semantic, spacing } from "@/src/theme/tokens";

interface SectionHeaderProps {
  title: string;
  action?: string;
}

export function SectionHeader({ action, title }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="h3">{title}</AppText>
      {action ? <AppText style={styles.action}>{action}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[3],
  },
  action: {
    color: semantic.textAccent,
  },
});
