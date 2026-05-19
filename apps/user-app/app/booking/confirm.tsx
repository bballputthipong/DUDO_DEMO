import { router } from "expo-router";
import { ArrowLeft, CalendarDays, CircleAlert, Clock } from "lucide-react-native";
import { type ReactNode } from "react";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useActivityQuery, useCreateBookingMutation } from "@/src/api/hooks";
import { AppText } from "@/src/components/AppText";
import { AsyncStateView } from "@/src/components/AsyncStateView";
import { BookingCard } from "@/src/components/BookingCard";
import { Button } from "@/src/components/Button";
import { Screen } from "@/src/components/Screen";
import { useBookingStore } from "@/src/stores/booking-store";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function BookingConfirmScreen() {
  const draft = useBookingStore((state) => state.draft);
  const setRecentBooking = useBookingStore((state) => state.setRecentBooking);
  const activityQuery = useActivityQuery(draft?.activityId ?? "");
  const createBookingMutation = useCreateBookingMutation();
  const [confirmed, setConfirmed] = useState(false);
  const activity = activityQuery.data;
  const selectedSlot = useMemo(() => activity?.slots.find((slot) => slot.id === draft?.slotId), [activity, draft?.slotId]);

  const state = (
    <AsyncStateView
      empty={!draft || !selectedSlot}
      emptyDescription="BackไปSelectActivityAndช่วงTimeBefore"
      emptyTitle="YetNotHasTimeAtSelect"
      error={activityQuery.error}
      loading={activityQuery.isLoading}
      onRetry={() => {
        void activityQuery.refetch();
      }}
    />
  );

  if (!draft || !activity || !selectedSlot) {
    return (
      <Screen>
        <View style={styles.modalHeader}>
          <Pressable accessibilityRole="button" style={styles.iconButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.navy[700]} size={22} />
          </Pressable>
        </View>
        {state}
      </Screen>
    );
  }

  const previewBooking = {
    id: "preview",
    activityId: activity.id,
    activityTitle: activity.title,
    partnerName: activity.partnerName,
    imageUrl: activity.imageUrl,
    status: "confirmed" as const,
    startsAt: selectedSlot.startsAt,
    timeLabel: selectedSlot.timeLabel,
    tokenUsed: activity.tokenPrice,
    checkInCode: "DUDO-PREVIEW",
  };

  return (
    <Screen>
      <View style={styles.modalHeader}>
        <Pressable accessibilityRole="button" style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.navy[700]} size={22} />
        </Pressable>
        <AppText variant="title">Confirm Booking</AppText>
        <View style={styles.iconSpacer} />
      </View>

      <View style={styles.content}>
        <BookingCard booking={previewBooking} />

        <View style={styles.summaryCard}>
          <SummaryRow icon={<CalendarDays color={colors.navy[700]} size={18} />} label="Date" value={selectedSlot.dateLabel} />
          <SummaryRow icon={<Clock color={colors.navy[700]} size={18} />} label="Time" value={selectedSlot.timeLabel} />
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <AppText variant="title">Token cost</AppText>
            <AppText style={styles.total}>{activity.tokenPrice}</AppText>
          </View>
        </View>

        <View style={styles.notice}>
          <CircleAlert color={colors.accent[700]} size={18} />
          <AppText style={styles.noticeText}>System deducts tokens in order: bonus → corporate → personal upon confirmation</AppText>
        </View>

        {createBookingMutation.isError ? <AppText style={styles.error}>{createBookingMutation.error.message}</AppText> : null}

        <Button
          fullWidth
          loading={createBookingMutation.isPending}
          size="lg"
          success={confirmed}
          title={confirmed ? "bookingSuccess" : createBookingMutation.isPending ? "Booking..." : `Confirm ${activity.tokenPrice} tokens`}
          onPress={() => {
            createBookingMutation.mutate(draft, {
              onSuccess: (booking) => {
                setRecentBooking(booking);
                setConfirmed(true);
                setTimeout(() => {
                  router.replace("/booking/success");
                }, 520);
              },
            });
          }}
        />
      </View>
    </Screen>
  );
}

function SummaryRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryIcon}>{icon}</View>
      <AppText muted style={styles.summaryLabel}>
        {label}
      </AppText>
      <AppText variant="title">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[6],
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 44,
    ...shadow.xs,
  },
  iconSpacer: {
    width: 44,
  },
  content: {
    gap: spacing[5],
  },
  summaryCard: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    gap: spacing[4],
    padding: spacing[4],
    ...shadow.sm,
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: semantic.bgNavyMuted,
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  summaryLabel: {
    flex: 1,
  },
  divider: {
    backgroundColor: semantic.borderSubtle,
    height: 1,
  },
  totalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
  },
  notice: {
    alignItems: "center",
    backgroundColor: semantic.bgAccentSubtle,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing[2],
    padding: spacing[3],
  },
  noticeText: {
    color: colors.accent[700],
    flex: 1,
    fontSize: typography.size.sm,
  },
  error: {
    color: semantic.borderError,
  },
});
