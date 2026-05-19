export interface CategoryStat {
  category: string;
  count: number;
}

export interface UserStats {
  userId: string;
  period: string;
  totalActivities: number;
  totalTokensSpent: number;
  categoryBreakdown: CategoryStat[];
  currentStreak: number;
  longestStreak: number;
  favoritePartner: { name: string; visitCount: number } | null;
}

export interface CorporateAggregateStat {
  category: string;
  bookingCount: number;
  hourOfDay: number;
}
