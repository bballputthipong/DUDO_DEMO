import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react-native";
import { type ReactNode } from "react";
import { useMemo, useState } from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";

import { useActivityQuery } from "@/src/api/hooks";
import { AppText } from "@/src/components/AppText";
import { AsyncStateView } from "@/src/components/AsyncStateView";
import { Button } from "@/src/components/Button";
import { PillSelect } from "@/src/components/PillSelect";
import { Screen } from "@/src/components/Screen";
import { Tag } from "@/src/components/Tag";
import { useBookingStore } from "@/src/stores/booking-store";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function ActivityDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const activityId = typeof params.id === "string" ? params.id : "";
  const activityQuery = useActivityQuery(activityId);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const setDraft = useBookingStore((state) => state.setDraft);
  const activity = activityQuery.data;
  const selectedSlot = useMemo(() => activity?.slots.find((slot) => slot.id === selectedSlotId), [activity, selectedSlotId]);

  const state = (
    <AsyncStateView
      empty={activityQuery.isSuccess && !activity}
      emptyTitle="NotพบActivityนี้"
      error={activityQuery.error}
      loading={activityQuery.isLoading}
      onRetry={() => {
        void activityQuery.refetch();
      }}
    />
  );

  if (!activity) {
    return <Screen>{state}</Screen>;
  }

  return (
    <Screen padded={false}>
      <ImageBackground source={{ uri: activity.imageUrl }} style={styles.hero}>
        <View style={styles.heroOverlay} />
        <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={semantic.textHeading} size={22} />
        </Pressable>
        <View style={styles.heroFooter}>
          <Tag label={activity.category} variant="accent" />
          <AppText inverse style={styles.heroTitle}>
            {activity.title}
          </AppText>
          <AppText inverse style={styles.heroMeta}>
            {activity.partnerName} · {activity.location}
          </AppText>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.statsRow}>
          <Stat icon={<Star color={colors.accent[400]} fill={colors.accent[400]} size={16} />} label={`${activity.rating.toFixed(1)} rating`} />
          <Stat icon={<Clock color={colors.navy[700]} size={16} />} label={`${activity.durationMinutes} min`} />
          <Stat icon={<MapPin color={colors.navy[700]} size={16} />} label={`${activity.distanceKm.toFixed(1)} km`} />
        </View>

        <View style={styles.section}>
          <AppText variant="h3">Details</AppText>
          <AppText muted>{activity.description}</AppText>
          <View style={styles.benefitRow}>
            {activity.benefits.map((benefit) => (
              <Tag key={benefit} label={benefit} variant="neutral" />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h3">SelectTime</AppText>
          <View style={styles.slotGrid}>
            {activity.slots.map((slot) => (
              <PillSelect
                key={slot.id}
                disabled={!slot.isAvailable}
                label={`${slot.dateLabel} · ${slot.timeLabel}`}
                selected={selectedSlotId === slot.id}
                onPress={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomBar}>
          <View>
            <AppText muted>Use token</AppText>
            <AppText variant="title">{activity.tokenPrice} tokens</AppText>
          </View>
          <Button
            disabled={!selectedSlot}
            title={selectedSlot ? "SelectTimeนี้" : "SelectTimeBefore"}
            onPress={() => {
              if (selectedSlot) {
                setDraft({ activityId: activity.id, slotId: selectedSlot.id });
                router.push("/booking/confirm");
              }
            }}
          />
        </View>
      </View>
    </Screen>
  );
}

function Stat({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <View style={styles.stat}>
      {icon}
      <AppText style={styles.statLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 360,
    justifyContent: "flex-end",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.overlayStrong,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: semantic.frostedWhite,
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    left: spacing[5],
    position: "absolute",
    top: spacing[6],
    width: 44,
    ...shadow.sm,
  },
  heroFooter: {
    alignItems: "flex-start",
    gap: spacing[2],
    padding: spacing[5],
  },
  heroTitle: {
    fontFamily: typography.fontFamily.thaiBold,
    fontSize: typography.size["2xl"],
    lineHeight: typography.size["2xl"] * typography.lineHeight.tight,
  },
  heroMeta: {
    color: semantic.whiteSoft,
    fontSize: typography.size.base,
  },
  content: {
    gap: spacing[6],
    padding: spacing[5],
    paddingBottom: spacing[16],
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  stat: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    flex: 1,
    flexDirection: "row",
    gap: spacing[1],
    justifyContent: "center",
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    ...shadow.xs,
  },
  statLabel: {
    color: semantic.textSecondary,
    fontFamily: typography.fontFamily.thaiMedium,
    fontSize: typography.size.xs,
  },
  section: {
    gap: spacing[3],
  },
  benefitRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  bottomBar: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing[4],
    ...shadow.md,
  },
});
