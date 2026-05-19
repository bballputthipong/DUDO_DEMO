import { StyleSheet, View } from "react-native";

import { useBookingsQuery } from "@/src/api/hooks";
import { AppText } from "@/src/components/AppText";
import { AsyncStateView } from "@/src/components/AsyncStateView";
import { BookingCard } from "@/src/components/BookingCard";
import { Screen } from "@/src/components/Screen";
import { SectionHeader } from "@/src/components/SectionHeader";
import { useAuthStore } from "@/src/stores/auth-store";
import { spacing } from "@/src/theme/tokens";

export default function BookingsScreen() {
  const userId = useAuthStore((state) => state.user?.id ?? "user-demo");
  const bookingsQuery = useBookingsQuery(userId);
  const items = bookingsQuery.data ?? [];
  const upcoming = items.filter((booking) => booking.status === "confirmed" || booking.status === "checked-in");
  const past = items.filter((booking) => booking.status !== "confirmed" && booking.status !== "checked-in");

  const state = (
    <AsyncStateView
      empty={items.length === 0}
      emptyDescription="whenyourActivity booking itemsจะมาอยู่Atนี่"
      emptyTitle="YetNotHas booking"
      error={bookingsQuery.error}
      loading={bookingsQuery.isLoading}
      onRetry={() => {
        void bookingsQuery.refetch();
      }}
    />
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">BookingOfyour</AppText>
        <AppText muted>ดูTime upcoming AndHistoryAtUse token ไปDone</AppText>
      </View>

      {bookingsQuery.isSuccess && items.length > 0 ? (
        <View style={styles.sections}>
          <View>
            <SectionHeader title="Upcoming" />
            <View style={styles.list}>
              {upcoming.length > 0 ? upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />) : <AppText muted>NotHasitems upcoming</AppText>}
            </View>
          </View>

          <View>
            <SectionHeader title="Past" />
            <View style={styles.list}>
              {past.length > 0 ? past.map((booking) => <BookingCard key={booking.id} booking={booking} />) : <AppText muted>YetNotHasHistoryการUseงาน</AppText>}
            </View>
          </View>
        </View>
      ) : (
        state
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  sections: {
    gap: spacing[8],
  },
  list: {
    gap: spacing[3],
  },
});
