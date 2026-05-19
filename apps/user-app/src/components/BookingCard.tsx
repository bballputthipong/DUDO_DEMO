import { CalendarDays, Clock } from "lucide-react-native";
import { ImageBackground, StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { Tag } from "@/src/components/Tag";
import { radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";
import type { Booking, BookingStatus } from "@/src/types/domain";

interface BookingCardProps {
  booking: Booking;
}

const statusLabel: Record<BookingStatus, string> = {
  confirmed: "ConfirmDone",
  "checked-in": "เช็กอินDone",
  completed: "Success",
  cancelled: "Cancel",
  "no-show": "Notเข้าUse",
};

export function BookingCard({ booking }: BookingCardProps) {
  const dateLabel = new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short" }).format(new Date(booking.startsAt));

  return (
    <View style={styles.card}>
      <ImageBackground imageStyle={styles.image} source={{ uri: booking.imageUrl }} style={styles.media} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Tag label={statusLabel[booking.status]} variant={booking.status === "confirmed" ? "navy" : "neutral"} />
          <AppText muted style={styles.token}>
            {booking.tokenUsed} tokens
          </AppText>
        </View>
        <AppText numberOfLines={1} variant="title">
          {booking.activityTitle}
        </AppText>
        <AppText muted numberOfLines={1}>
          {booking.partnerName}
        </AppText>
        <View style={styles.metaGrid}>
          <View style={styles.metaRow}>
            <CalendarDays color={semantic.textSecondary} size={14} />
            <AppText muted style={styles.metaText}>
              {dateLabel}
            </AppText>
          </View>
          <View style={styles.metaRow}>
            <Clock color={semantic.textSecondary} size={14} />
            <AppText muted style={styles.metaText}>
              {booking.timeLabel}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing[3],
    overflow: "hidden",
    ...shadow.sm,
  },
  media: {
    height: 104,
    width: 104,
  },
  image: {
    borderBottomLeftRadius: radius.lg,
    borderTopLeftRadius: radius.lg,
  },
  body: {
    flex: 1,
    gap: spacing[1],
    paddingRight: spacing[3],
    paddingVertical: spacing[3],
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  token: {
    fontFamily: typography.fontFamily.thaiSemibold,
    fontSize: typography.size.xs,
  },
  metaGrid: {
    flexDirection: "row",
    gap: spacing[3],
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  metaText: {
    fontSize: typography.size.xs,
  },
});
