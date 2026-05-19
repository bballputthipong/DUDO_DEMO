import { RefreshCw } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { colors, radius, semantic, spacing } from "@/src/theme/tokens";

interface AsyncStateViewProps {
  loading: boolean;
  error: unknown;
  empty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  onRetry?: () => void;
}

export function AsyncStateView({ empty, emptyDescription, emptyTitle, error, loading, onRetry }: AsyncStateViewProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.navy[700]} />
        <AppText muted>Loading...้อมูล...</AppText>
      </View>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return (
      <View style={styles.container}>
        <RefreshCw color={colors.navy[700]} size={24} />
        <AppText variant="title">โหลดNotSuccess</AppText>
        <AppText muted style={styles.center}>
          {message}
        </AppText>
        {onRetry ? <Button title="ลองอีกครั้ง" variant="secondary" onPress={onRetry} /> : null}
      </View>
    );
  }

  if (empty) {
    return (
      <View style={styles.container}>
        <AppText variant="title">{emptyTitle}</AppText>
        {emptyDescription ? (
          <AppText muted style={styles.center}>
            {emptyDescription}
          </AppText>
        ) : null}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    gap: spacing[3],
    padding: spacing[6],
  },
  center: {
    textAlign: "center",
  },
});
