import { router } from "expo-router";
import { CircleCheck } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { BookingCard } from "@/src/components/BookingCard";
import { Button } from "@/src/components/Button";
import { Screen } from "@/src/components/Screen";
import { useBookingStore } from "@/src/stores/booking-store";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function BookingSuccessScreen() {
  const booking = useBookingStore((state) => state.recentBooking);
  const scale = useRef(new Animated.Value(0.72)).current;

  useEffect(() => {
    Animated.spring(scale, {
      friction: 6,
      tension: 80,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Screen>
      <View style={styles.center}>
        <Animated.View style={[styles.checkWrap, { transform: [{ scale }] }]}>
          <CircleCheck color={semantic.textInverse} size={44} strokeWidth={2.2} />
        </Animated.View>
        <AppText style={styles.heading}>bookingSuccessDone!</AppText>
        <AppText muted style={styles.sub}>
          Use check-in code นี้whenToสถานAt
        </AppText>
      </View>

      {booking ? (
        <View style={styles.content}>
          <BookingCard booking={booking} />
          <View style={styles.codeCard}>
            <AppText muted>Check-in code</AppText>
            <AppText style={styles.code}>{booking.checkInCode}</AppText>
          </View>
        </View>
      ) : (
        <View style={styles.codeCard}>
          <AppText muted>No recent bookings found</AppText>
        </View>
      )}

      <View style={styles.actions}>
        <Button fullWidth title="View All Bookings" variant="ghost" onPress={() => router.replace("/(tabs)/bookings")} />
        <Button fullWidth title="Back to Home" onPress={() => router.replace("/(tabs)/explore")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    gap: spacing[3],
    marginBottom: spacing[8],
    marginTop: spacing[6],
  },
  checkWrap: {
    alignItems: "center",
    backgroundColor: colors.accent[400],
    borderRadius: radius.full,
    height: 92,
    justifyContent: "center",
    width: 92,
    ...shadow.md,
  },
  heading: {
    color: semantic.textHeading,
    fontFamily: typography.fontFamily.thaiBold,
    fontSize: typography.size["2xl"],
  },
  sub: {
    textAlign: "center",
  },
  content: {
    gap: spacing[4],
  },
  codeCard: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    gap: spacing[2],
    padding: spacing[6],
    ...shadow.sm,
  },
  code: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
    letterSpacing: 1.2,
  },
  actions: {
    gap: spacing[3],
    marginTop: spacing[8],
  },
});
