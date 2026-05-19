import { MapPin, Star } from "lucide-react-native";
import { ImageBackground, Pressable, StyleSheet, View, type PressableProps } from "react-native";

import { AppText } from "@/src/components/AppText";
import { Tag } from "@/src/components/Tag";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";
import type { WellnessActivity } from "@/src/types/domain";

interface ActivityCardProps extends Omit<PressableProps, "style"> {
  activity: WellnessActivity;
  mode?: "featured" | "list" | "square";
}

export function ActivityCard({ activity, mode = "featured", ...props }: ActivityCardProps) {
  if (mode === "list") {
    return (
      <Pressable style={({ pressed }) => [styles.listCard, pressed && styles.pressed]} {...props}>
        <ImageBackground imageStyle={styles.listImage} source={{ uri: activity.imageUrl }} style={styles.listMedia} />
        <View style={styles.listBody}>
          <Tag label={activity.category} variant="navy" />
          <AppText numberOfLines={1} variant="title">
            {activity.title}
          </AppText>
          <AppText muted numberOfLines={1}>
            {activity.partnerName}
          </AppText>
          <View style={styles.metaRow}>
            <MapPin color={semantic.textSecondary} size={14} />
            <AppText muted style={styles.metaText}>
              {activity.location} · {activity.distanceKm.toFixed(1)} km
            </AppText>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={({ pressed }) => [mode === "square" ? styles.squareCard : styles.featuredCard, pressed && styles.pressed]} {...props}>
      <ImageBackground imageStyle={styles.heroImage} source={{ uri: activity.imageUrl }} style={styles.heroImageWrap}>
        <View style={styles.overlay} />
        <View style={styles.footer}>
          <View style={styles.cardTop}>
            <Tag label={activity.category} variant="accent" />
            <View style={styles.ratingBadge}>
              <Star color={colors.accent[400]} fill={colors.accent[400]} size={12} />
              <AppText style={styles.ratingText}>{activity.rating.toFixed(1)}</AppText>
            </View>
          </View>
          <AppText inverse numberOfLines={2} style={styles.heroTitle}>
            {activity.title}
          </AppText>
          <AppText inverse numberOfLines={1} style={styles.heroMeta}>
            {activity.partnerName} · {activity.tokenPrice} tokens
          </AppText>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    minWidth: 240,
    overflow: "hidden",
    width: 240,
    ...shadow.sm,
  },
  squareCard: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    flex: 1,
    overflow: "hidden",
    ...shadow.sm,
  },
  heroImageWrap: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderRadius: radius.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.overlayStrong,
  },
  footer: {
    gap: spacing[1],
    padding: spacing[3],
  },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingBadge: {
    alignItems: "center",
    backgroundColor: semantic.ratingBadgeBg,
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
  },
  ratingText: {
    color: colors.neutral[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.thaiSemibold,
    fontSize: typography.size.base,
    lineHeight: typography.size.base * 1.3,
  },
  heroMeta: {
    color: semantic.whiteMuted,
    fontSize: typography.size.xs,
  },
  listCard: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing[3],
    minHeight: 104,
    overflow: "hidden",
    ...shadow.sm,
  },
  listMedia: {
    height: 104,
    width: 104,
  },
  listImage: {
    borderBottomLeftRadius: radius.lg,
    borderTopLeftRadius: radius.lg,
  },
  listBody: {
    flex: 1,
    gap: spacing[1],
    justifyContent: "center",
    paddingRight: spacing[3],
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  metaText: {
    fontSize: typography.size.xs,
  },
  pressed: {
    transform: [{ translateY: -2 }],
    ...shadow.md,
  },
});
