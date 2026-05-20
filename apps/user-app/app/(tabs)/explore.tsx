import { router } from "expo-router";
import { BlurView } from "expo-blur";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  Dumbbell,
  Flame,
  Hand,
  Heart,
  LocateFixed,
  Moon,
  MousePointer2,
  Plus,
  SlidersHorizontal,
  Star,
  Tag as TagIcon,
  UserPlus,
  UserRound,
  X,
} from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Image, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { AppText } from "@/src/components/AppText";
import { activities } from "@/src/data/mock-data";
import { useAuthStore } from "@/src/stores/auth-store";
import { webPhoneShell } from "@/src/theme/layout";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

const quickActions = [
  { label: "Near by", icon: <LocateFixed color={colors.navy[700]} fill={colors.navy[700]} size={34} /> },
  { label: "Check-in", icon: <Bookmark color={colors.navy[700]} fill={colors.navy[700]} size={34} /> },
  { label: "Challenges", icon: <Dumbbell color={colors.navy[700]} size={36} strokeWidth={3} /> },
  { label: "Partner\nPasses", icon: <Hand color={colors.accent[500]} fill={colors.accent[500]} size={34} /> },
  { label: "Tonight", icon: <Moon color={colors.navy[700]} fill={colors.navy[700]} size={34} /> },
  { label: "Rebook", icon: <MousePointer2 color={colors.navy[700]} fill={colors.navy[700]} size={34} /> },
  { label: "Recovery", icon: <Dumbbell color={colors.accent[500]} size={34} strokeWidth={2.6} /> },
  { label: "Invite\nFriends", icon: <UserPlus color={colors.navy[700]} fill={colors.navy[700]} size={34} /> },
];

const tokenLegend = [
  { label: "Ice bath & sauna", value: "27%", color: colors.navy[500] },
  { label: "Boxing", value: "13%", color: colors.navy[300] },
  { label: "Pilates", value: "11%", color: colors.accent[400] },
  { label: "Climbing & Bouldering", value: "8.7%", color: colors.navy[800] },
];

const streakColumns = ["S", "M", "T", "W", "Th", "F", "Sa", "", "LV"];

const streakRows = [
  [
    { day: "30", active: false },
    { day: "1", active: true },
    { day: "2", active: false },
    { day: "3", active: true },
    { day: "4", active: true },
    { day: "5", active: false },
    { day: "6", active: false },
    { day: "", active: false, empty: true },
    { day: "", active: true, level: true },
  ],
  [
    { day: "7", active: true, selected: true },
    { day: "8", active: false },
    { day: "9", active: false },
    { day: "10", active: false },
    { day: "11", active: false },
    { day: "12", active: false },
    { day: "", active: false, empty: true },
    { day: "", active: false, empty: true },
    { day: "", active: false, level: true },
  ],
];

const promotionItems = [
  {
    title: "Move More Challenge",
    subtitle: "Complete 5 activities in 7 days and earn 2 bonus tokens.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    action: "Join Challenge",
  },
  {
    title: "Double Token Days",
    subtitle: "Book 2 classes in one day and receive 1 token back.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=900&q=80",
    action: "Book Now",
  },
  {
    title: "Night Bouldering",
    subtitle: "Get 20% off token usage for climbing sessions from 8:00 PM.",
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
    action: "Reserve Session",
  },
  {
    title: "Late Night Reset",
    subtitle: "Enjoy 25% off recovery and sauna sessions after 7:00 PM.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    action: "Book Recovery",
  },
  {
    title: "Active Together",
    subtitle: "Book with 3 friends and unlock group perks on selected classes.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    action: "Invite Friends",
  },
];

const trendingStudios = [
  {
    title: "Pillar Pilates Studio",
    location: "Ekkamia - Phra Khanong",
    distance: "200m",
    rating: "4.5",
    tags: ["Pilates", "Budgeting"],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "ICE HOUSE Rooftop Bath",
    location: "Ekkamia - Phra Khanong",
    distance: "350m",
    rating: "4.7",
    tags: ["Ice bath", "Budgeting"],
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Muay Thai Academy M.T.A",
    location: "Ekkamia - Phra Khanong",
    distance: "270m",
    rating: "4.6",
    tags: ["MuayThai", "Boxing"],
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "The Racquet Club (RQ49)",
    location: "Sukhumvit 49",
    distance: "250m",
    rating: "3.2",
    tags: ["Bouldering", "Gym"],
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Ontrack Campus - W District",
    location: "Ekkamia - Phra Khanong",
    distance: "50m",
    rating: "4.5",
    tags: ["HIIT", "Hyrox"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Cubic EmSphere",
    location: "Promphong",
    distance: "150m",
    rating: "4.5",
    tags: ["HIIT", "Hyrox"],
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Ontrack Station - National Stadium",
    location: "National Stadium",
    distance: "50m",
    rating: "4.5",
    tags: ["HIIT", "Hyrox"],
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Stonegoat Climbing Gym",
    location: "Phra Khanong",
    distance: "50m",
    rating: "4.5",
    tags: ["Bouldering"],
    image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=900&q=80",
  },
];

const planTiers = [
  {
    kind: "free" as const,
    title: "Free",
    description: "Stay connected and track your wellness journey.",
    price: null,
    tokens: null,
    cta: "See more details",
    includes: ["Activity tracking", "Basic wellness insights", "Join community & challenges", "Post reviews & check-ins", "Save favorite places"],
  },
  {
    kind: "plus" as const,
    title: "Plus",
    description: "Flexible access for everyday movement and recovery.",
    price: "1,290",
    tokens: "30 Tokens",
    cta: "Get Plus",
    includes: ["Access to all partner activities", "10% discount on extra tokens", "Advanced activity tracking", "Monthly challenges & rewards", "Priority booking access"],
  },
  {
    kind: "pro" as const,
    title: "Pro",
    description: "Premium flexibility for active lifestyles.",
    price: "2,490",
    tokens: "75 Tokens",
    cta: "Get Pro",
    includes: ["Everything in Plus", "15% discount on extra tokens", "Premium studios & recovery access", "2 guest passes/month", "Advanced wellness analytics"],
  },
  {
    kind: "black" as const,
    title: "Black",
    description: "The ultimate all-access wellness membership.",
    price: "5,990",
    tokens: "160 Tokens",
    cta: "Get Black",
    includes: ["Everything in Pro", "25% discount on extra tokens", "VIP booking windows", "Concierge-style support", "Premium events & experiences"],
  },
];

const recommendedFilters = ["Pilates", "Yoga", "Crossfit", "Budgeting"];

const recommendedStudios = [
  {
    title: "Pillar Pilates Studio",
    rating: "4.5",
    reviews: "1123",
    price: "$$$",
    location: "Ekkamia - Phra Khanong",
    distance: "200m",
    className: "Pilates Individual",
    passName: "Gym pass",
    action: "See all 7 class",
    tags: ["Pilates", "Budgeting", "Girly", "Sporty"],
    times: ["16:00", "16:30", "17:00", "17:30", "18:00"],
    image: trendingStudios[0]?.image ?? activities[0]?.imageUrl,
  },
  {
    title: "Balance Yoga Center",
    rating: "4.8",
    reviews: "852",
    price: "$$$",
    location: "Sukhumvit 24",
    distance: "300m",
    className: "Vinyasa Flow",
    passName: "Monthly Pass",
    action: "See all 5 class",
    tags: ["Yoga", "Relaxation", "Trendy", "Zen"],
    times: ["09:00", "09:30", "10:00", "10:30", "11:00"],
    image: trendingStudios[0]?.image ?? activities[1]?.imageUrl,
  },
  {
    title: "Zen Fitness Hub",
    rating: "4.7",
    reviews: "456",
    price: "$$$",
    location: "Chinatown",
    distance: "150m",
    className: "HIIT Session",
    passName: "10-Class Pack",
    action: "See all 4 class",
    tags: ["CrossFit", "Strength", "Edgy", "Athletic"],
    times: ["07:30", "08:00", "08:30", "09:00", "09:30"],
    image: trendingStudios[0]?.image ?? activities[2]?.imageUrl,
  },
  {
    title: "Core Strength Academy",
    rating: "4.6",
    reviews: "732",
    price: "$$$$",
    location: "Ratchada",
    distance: "400m",
    className: "Strength Training",
    passName: "Membership",
    action: "See all 6 class",
    tags: ["Weight lifting", "Challenge", "Masculine", "Intense"],
    times: ["12:00", "12:30", "13:00", "13:30", "14:00"],
    image: trendingStudios[0]?.image ?? activities[3]?.imageUrl,
  },
  {
    title: "Serenity Dance Studio",
    rating: "4.9",
    reviews: "981",
    price: "$$",
    location: "Silom",
    distance: "500m",
    className: "Ballet Class",
    passName: "Class Pass",
    action: "See all 3 class",
    tags: ["Dance", "Artistic", "Feminine", "Expressive"],
    times: ["15:00", "15:30", "16:00", "16:30", "17:00"],
    image: trendingStudios[0]?.image ?? activities[0]?.imageUrl,
  },
  {
    title: "Flexibility Studio",
    rating: "4.4",
    reviews: "654",
    price: "$",
    location: "Bangkok Old Town",
    distance: "250m",
    className: "Basic Stretch",
    passName: "Single Entry",
    action: "See all 2 class",
    tags: ["Stretching", "Mobility", "Light", "Comfort"],
    times: ["18:30", "19:00", "19:30", "20:00", "20:30"],
    image: trendingStudios[0]?.image ?? activities[1]?.imageUrl,
  },
];

type RecommendedStudio = (typeof recommendedStudios)[number];

type SelectedBooking = {
  className: string;
  distance: string;
  location: string;
  passName: string;
  price: string;
  studioTitle: string;
  time: string;
};

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.split(" ")[0] ?? "DUDO";
  const featured = activities.slice(0, 4);
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null);
  const selectedSlotId = selectedBooking ? `${selectedBooking.studioTitle}-${selectedBooking.time}` : null;

  const handleSelectTime = (studio: RecommendedStudio, time: string) => {
    setSelectedBooking({
      className: studio.className,
      distance: studio.distance,
      location: studio.location,
      passName: studio.passName,
      price: studio.price,
      studioTitle: studio.title,
      time,
    });
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.root, webPhoneShell]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
            <Defs>
              <LinearGradient id="heroGradient" x1="0" x2="1" y1="0" y2="0.85">
                <Stop offset="0" stopColor={colors.navy[900]} />
                <Stop offset="0.62" stopColor={colors.navy[700]} />
                <Stop offset="1" stopColor={colors.accent[400]} />
              </LinearGradient>
            </Defs>
            <Rect fill="url(#heroGradient)" height="100%" width="100%" x="0" y="0" />
          </Svg>

          <View style={styles.statusRow}>
            <AppText inverse style={styles.statusTime}>
              9:41
            </AppText>
            <View style={styles.statusIcons}>
              <View style={styles.signalBars}>
                <View style={[styles.signalBar, { height: 7 }]} />
                <View style={[styles.signalBar, { height: 10 }]} />
                <View style={[styles.signalBar, { height: 13 }]} />
                <View style={[styles.signalBar, { height: 16 }]} />
              </View>
              <View style={styles.wifiMark} />
              <View style={styles.battery} />
            </View>
          </View>

          <View style={styles.greetingCard}>
            <AppText inverse style={styles.greetingText}>
              Good Morning,{"\n"}
              {firstName}
            </AppText>
            <View style={styles.avatar}>
              <UserRound color={colors.neutral[800]} fill={colors.neutral[800]} size={34} />
            </View>
          </View>
        </View>

        <View style={styles.sections}>
        <View style={[styles.card, styles.quickCard]}>
          <View style={styles.sectionHead}>
            <AppText style={styles.bigTitle}>Quick Access</AppText>
            <SeeMore />
          </View>
          <View style={styles.quickGrid}>
            {quickActions.map((item) => (
              <Pressable key={item.label} style={({ pressed }) => [styles.quickTile, pressed && styles.pressed]}>
                {item.icon}
                <AppText style={styles.quickLabel}>{item.label}</AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.wellnessHead}>
            <AppText style={styles.wellnessTitle}>Your Wellness{"\n"}This Month</AppText>
            <Pressable style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}>
              <ChevronRight color={semantic.textInverse} size={26} strokeWidth={2.2} />
            </Pressable>
          </View>

          <View style={styles.wellnessBody}>
            <TokenDonut />
            <View style={styles.tokenPanel}>
              <AppText style={styles.tokenTitle}>Token Usage</AppText>
              <View style={styles.tokenBlocks}>
                {Array.from({ length: 20 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tokenBlock,
                      index < 4 && { backgroundColor: colors.navy[500] },
                      index >= 4 && index < 10 && { backgroundColor: colors.navy[300] },
                      index >= 10 && index < 13 && { backgroundColor: colors.accent[400] },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.legendList}>
                {tokenLegend.map((item) => (
                  <View key={item.label} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <AppText style={styles.legendLabel}>{item.label}</AppText>
                    <AppText style={styles.legendValue}>{item.value}</AppText>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Metric title="Move" value="14" unit="Sessions" />
            <Metric title="Recover" value="5" unit="Recovery visits" />
            <Metric title="Explore" value="6" unit="New Places" />
          </View>
        </View>

        <View style={styles.streakCard}>
          <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
            <Defs>
              <LinearGradient id="streakGradient" x1="0" x2="1" y1="0" y2="1">
                <Stop offset="0" stopColor={colors.navy[800]} />
                <Stop offset="1" stopColor={colors.navy[950]} />
              </LinearGradient>
            </Defs>
            <Rect fill="url(#streakGradient)" height="100%" rx={16} width="100%" x="0" y="0" />
          </Svg>
          <View style={styles.streakHead}>
            <View>
              <AppText inverse style={styles.streakMonth}>
                May 2026
              </AppText>
              <View style={styles.streakStats}>
                <View>
                  <AppText inverse style={styles.streakMeta}>
                    Your streak
                  </AppText>
                  <AppText inverse style={styles.streakNumber}>
                    5 Weeks
                  </AppText>
                </View>
                <View>
                  <AppText inverse style={styles.streakMeta}>
                    Streak Activities
                  </AppText>
                  <AppText inverse style={styles.streakNumber}>
                    12
                  </AppText>
                </View>
              </View>
            </View>
            <SeeMore inverse />
          </View>
          <View style={styles.weekGrid}>
            {streakColumns.map((day, index) => (
              <AppText key={`${day}-${index}`} inverse style={styles.weekLabel}>
                {day}
              </AppText>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {streakRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.calendarGridRow}>
                {row.map((item, index) => (
                  <View key={`${item.day}-${rowIndex}-${index}`} style={styles.dayCell}>
                    {item.empty ? null : (
                      <View style={[styles.dayCircle, item.level && styles.levelPill, item.selected && styles.daySelected]}>
                        {item.active ? (
                          <Flame color={colors.accent[400]} fill={colors.accent[400]} size={13} />
                        ) : item.level ? (
                          <View style={styles.levelRing} />
                        ) : (
                          <AppText style={styles.dayText}>{item.day}</AppText>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <Section title="Trending studio">
          <ScrollView contentContainerStyle={styles.horizontalList} horizontal showsHorizontalScrollIndicator={false}>
            {trendingStudios.map((studio, index) => (
              <Pressable key={studio.title} style={styles.studioCard} onPress={() => router.push(`/activity/${featured[index % featured.length]?.id ?? "act-yoga-flow"}`)}>
                <ImageBackground imageStyle={styles.studioImage} source={{ uri: studio.image }} style={styles.studioMedia}>
                  <ImageFadeOverlay />
                  <View style={styles.ratingBadge}>
                    <Star color={colors.accent[400]} fill={colors.accent[400]} size={12} />
                    <AppText style={styles.ratingText}>{studio.rating}</AppText>
                  </View>
                  <AppText inverse numberOfLines={2} style={styles.studioTitle}>
                    {studio.title}
                  </AppText>
                </ImageBackground>
                <AppText muted numberOfLines={2} style={styles.locationText}>
                  {studio.location} ({studio.distance})
                </AppText>
                <View style={styles.tagRow}>
                  {studio.tags.map((tag) => (
                    <MiniTag key={tag} label={tag} />
                  ))}
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Section>

        <Section title="Promotion">
          <ScrollView contentContainerStyle={styles.horizontalList} horizontal showsHorizontalScrollIndicator={false}>
            {promotionItems.map((item) => (
              <PromoCard key={item.title} {...item} />
            ))}
          </ScrollView>
        </Section>

        <Section title="Subscription Plan">
          <ScrollView contentContainerStyle={styles.planRow} horizontal showsHorizontalScrollIndicator={false}>
            {planTiers.map((tier) => (
              <PlanCard key={tier.title} tier={tier} />
            ))}
          </ScrollView>
        </Section>

        <Section title="DODO recommended">
          <ScrollView contentContainerStyle={styles.dodoRecommendedRow} horizontal showsHorizontalScrollIndicator={false}>
            {trendingStudios.slice(3).map((studio) => (
              <DodoRecommendedCard key={studio.title} studio={studio} />
            ))}
          </ScrollView>
        </Section>

        <Section title="Recommended classes">
          <View style={styles.recommendedPanel}>
            <ScrollView contentContainerStyle={styles.filterRow} horizontal showsHorizontalScrollIndicator={false}>
              <Pressable style={styles.filterButton}>
                <SlidersHorizontal color={colors.neutral[700]} size={18} />
              </Pressable>
              {recommendedFilters.map((filter) => (
                <View key={filter} style={styles.filterChip}>
                  <UserRound color={colors.neutral[700]} size={14} />
                  <AppText style={styles.filterLabel}>{filter}</AppText>
                </View>
              ))}
            </ScrollView>
            <View style={styles.recommendedList}>
              {recommendedStudios.map((studio) => (
                <RecommendedStudioCard key={studio.title} onSelectTime={handleSelectTime} selectedSlotId={selectedSlotId} studio={studio} />
              ))}
            </View>
          </View>
        </Section>
        </View>
      </ScrollView>
      <ReserveSheet booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </SafeAreaView>
  );
}

function SeeMore({ inverse = false }: { inverse?: boolean }) {
  return (
    <Pressable style={[styles.seeMore, inverse && styles.seeMoreDark]}>
      <AppText style={[styles.seeMoreText, inverse && styles.seeMoreTextDark]}>See more</AppText>
    </Pressable>
  );
}

function TokenDonut() {
  const circumference = 2 * Math.PI * 50;
  return (
    <View style={styles.donutWrap}>
      <Svg height={140} width={140}>
        <Circle cx={70} cy={70} fill="none" r={50} stroke={colors.navy[100]} strokeWidth={22} />
        <Circle
          cx={70}
          cy={70}
          fill="none"
          r={50}
          stroke={colors.navy[500]}
          strokeDasharray={`${circumference * 0.48} ${circumference}`}
          strokeLinecap="round"
          strokeWidth={22}
          transform="rotate(104 70 70)"
        />
        <Circle
          cx={70}
          cy={70}
          fill="none"
          r={50}
          stroke={colors.accent[400]}
          strokeDasharray={`${circumference * 0.22} ${circumference}`}
          strokeLinecap="round"
          strokeWidth={22}
          transform="rotate(-88 70 70)"
        />
      </Svg>
      <View style={styles.donutText}>
        <AppText style={styles.donutNumber}>41</AppText>
        <AppText style={styles.donutTotal}>/ 75</AppText>
        <AppText style={styles.donutUnit}>Tokens</AppText>
      </View>
    </View>
  );
}

function Metric({ title, unit, value }: { title: string; unit: string; value: string }) {
  return (
    <View style={styles.metric}>
      <AppText style={styles.metricTitle}>{title}</AppText>
      <View style={styles.metricValueRow}>
        <Dumbbell color={colors.neutral[700]} size={18} />
        <AppText style={styles.metricValue}>{value}</AppText>
      </View>
      <AppText style={styles.metricUnit}>{unit}</AppText>
    </View>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <SeeMore />
      </View>
      {children}
    </View>
  );
}

function MiniTag({ label }: { label: string }) {
  return (
    <View style={styles.miniTag}>
      <TagIcon color={colors.navy[700]} size={12} strokeWidth={2} />
      <AppText style={styles.miniTagText}>{label}</AppText>
    </View>
  );
}

function CompactTag({ label }: { label: string }) {
  return (
    <View style={styles.compactTag}>
      <TagIcon color={colors.neutral[800]} fill={colors.neutral[800]} size={10} strokeWidth={2} />
      <AppText numberOfLines={1} style={styles.compactTagText}>
        {label}
      </AppText>
    </View>
  );
}

function ImageFadeOverlay() {
  return (
    <Svg height="58%" style={styles.imageFadeOverlay} width="100%">
      <Defs>
        <LinearGradient id="imageFade" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={colors.navy[950]} stopOpacity="0" />
          <Stop offset="1" stopColor={colors.navy[950]} stopOpacity="0.68" />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#imageFade)" height="100%" width="100%" x="0" y="0" />
    </Svg>
  );
}

function DodoRecommendedCard({ studio }: { studio: (typeof trendingStudios)[number] }) {
  return (
    <Pressable style={styles.dodoRecommendedCard}>
      <ImageBackground imageStyle={styles.dodoRecommendedImage} source={{ uri: studio.image }} style={styles.dodoRecommendedMedia}>
        <View style={styles.ratingBadge}>
          <Star color={colors.accent[400]} fill={colors.accent[400]} size={12} />
          <AppText style={styles.ratingText}>{studio.rating}</AppText>
        </View>
      </ImageBackground>
      <AppText muted numberOfLines={2} style={styles.dodoRecommendedTitle}>
        {studio.title}
      </AppText>
    </Pressable>
  );
}

function PromoCard({ action, image, subtitle, title }: { action: string; image: string; subtitle: string; title: string }) {
  return (
    <View style={styles.promoCard}>
      <ImageBackground imageStyle={styles.promoImage} source={{ uri: image }} style={styles.promoMedia}>
        <View style={styles.promoScrim} />
        <AppText inverse style={styles.promoKicker}>
          DODO
        </AppText>
        <AppText inverse style={styles.promoImageTitle}>
          {title}
        </AppText>
        <View style={styles.promoAction}>
          <AppText style={styles.promoActionText}>{action}</AppText>
          <ChevronRight color={colors.navy[700]} size={14} />
        </View>
      </ImageBackground>
      <AppText numberOfLines={1} style={styles.promoTitle}>
        {title}
      </AppText>
      <AppText muted numberOfLines={2} style={styles.promoSubtitle}>
        {subtitle}
      </AppText>
    </View>
  );
}

function PlanCard({ tier }: { tier: (typeof planTiers)[number] }) {
  const isFree = tier.kind === "free";
  const isBlack = tier.kind === "black";
  const isPaid = !isFree;
  return (
    <View style={[styles.planCard, isFree ? styles.freePlan : styles.paidPlan, isBlack && styles.blackPlan]}>
      <AppText style={[styles.planTitle, isPaid && styles.paidText]}>{tier.title}</AppText>
      <AppText style={[styles.planCopy, isPaid && styles.paidSubText]}>{tier.description}</AppText>
      <View style={[styles.planDivider, isPaid && styles.paidDivider]} />
      {tier.price ? (
        <View style={styles.priceBlock}>
          <View style={styles.priceRow}>
            <AppText style={[styles.planPrice, styles.paidText]}>{tier.price}</AppText>
            <AppText style={[styles.priceUnit, styles.paidSubText]}>THB/month</AppText>
          </View>
          <AppText style={[styles.planTokens, styles.paidText]}>{tier.tokens}</AppText>
          <Pressable style={({ pressed }) => [styles.getButton, pressed && styles.pressed]}>
            <AppText style={styles.getButtonText}>{tier.cta}</AppText>
          </Pressable>
        </View>
      ) : null}
      <AppText style={[styles.planIncludes, isPaid && styles.paidText]}>{isFree ? "Includes:" : "Includes:"}</AppText>
      {tier.includes.map((item) => (
        <AppText key={item} style={[styles.planBullet, isPaid && styles.paidSubText]}>
          {`- ${item}`}
        </AppText>
      ))}
      <View style={styles.planFooter}>
        <AppText style={[styles.detailsText, isPaid && styles.paidDetailsText]}>{isPaid ? "See more details" : tier.cta}</AppText>
        <ChevronRight color={isPaid ? semantic.textInverse : semantic.textPrimary} size={18} />
      </View>
    </View>
  );
}

function RecommendedStudioCard({
  onSelectTime,
  selectedSlotId,
  studio,
}: {
  onSelectTime: (studio: RecommendedStudio, time: string) => void;
  selectedSlotId: string | null;
  studio: RecommendedStudio;
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const selectedTime = studio.times.find((time) => selectedSlotId === `${studio.title}-${time}`);
  const hasSelectedTime = Boolean(selectedTime);
  return (
    <View style={styles.recommendationItem}>
      <View style={styles.recommendationTop}>
        <View style={styles.recommendationMedia}>
          <Image source={{ uri: studio.image ?? "" }} style={[StyleSheet.absoluteFillObject, styles.recommendationImage]} resizeMode="cover" />
        </View>
        <View style={styles.recommendationCopy}>
          <View style={styles.titleRow}>
            <AppText numberOfLines={2} style={styles.recommendationTitle}>
              {studio.title}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isFavorite }}
              onPress={() => setIsFavorite((value) => !value)}
              style={({ pressed }) => [styles.favoriteButton, isFavorite && styles.favoriteButtonActive, pressed && styles.pressed]}
            >
              <Heart color={isFavorite ? colors.accent[400] : colors.neutral[700]} fill={isFavorite ? colors.accent[400] : semantic.transparent} size={20} />
            </Pressable>
          </View>
          <View style={styles.recommendationRating}>
            <Star color={colors.accent[400]} fill={colors.accent[400]} size={18} />
            <AppText style={styles.recommendationMeta}>
              {studio.rating} ({studio.reviews}) · {studio.price}
            </AppText>
          </View>
          <AppText muted numberOfLines={1} style={styles.recommendationLocation}>
            {studio.location} ({studio.distance})
          </AppText>
          <ScrollView contentContainerStyle={styles.recommendationTags} horizontal showsHorizontalScrollIndicator={false}>
            {studio.tags.map((tag) => (
              <CompactTag key={tag} label={tag} />
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.classRows}>
        <View style={styles.classBlock}>
          <AppText numberOfLines={1} style={styles.className}>
            {studio.className}
          </AppText>
          <ScrollView contentContainerStyle={styles.timeRow} horizontal showsHorizontalScrollIndicator={false}>
            {studio.times.map((time) => (
              <Pressable
                key={time}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedSlotId === `${studio.title}-${time}` }}
                onPress={() => onSelectTime(studio, time)}
                style={({ pressed }) => [styles.timePill, selectedSlotId === `${studio.title}-${time}` && styles.timePillSelected, pressed && styles.pressed]}
              >
                <AppText style={[styles.timeText, selectedSlotId === `${studio.title}-${time}` && styles.timeTextSelected]}>{time}</AppText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.classBlock}>
          <AppText numberOfLines={1} style={styles.className}>
            {studio.passName}
          </AppText>
          <View style={styles.passPill}>
            <AppText style={styles.timeText}>Single Class</AppText>
          </View>
        </View>
      </View>
      <Pressable
        onPress={selectedTime ? () => onSelectTime(studio, selectedTime) : undefined}
        style={({ pressed }) => [styles.seeClassesButton, hasSelectedTime && styles.seeClassesButtonSelected, pressed && styles.pressed]}
      >
        <AppText style={[styles.seeClassesText, hasSelectedTime && styles.seeClassesTextSelected]}>{hasSelectedTime ? "Reserve" : studio.action}</AppText>
        <ArrowRight color={hasSelectedTime ? semantic.textInverse : colors.navy[700]} size={24} />
      </Pressable>
    </View>
  );
}

function ReserveSheet({ booking, onClose }: { booking: SelectedBooking | null; onClose: () => void }) {
  return (
    <Modal animationType="slide" transparent visible={Boolean(booking)} onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <BlurView intensity={36} tint="light" style={StyleSheet.absoluteFill} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalClose}>
          <X color={semantic.textInverse} size={18} />
        </Pressable>
        <BlurView intensity={82} tint="light" style={styles.reserveSheet}>
          <View style={styles.reserveHandle} />
          <View style={styles.reserveCopy}>
            <View style={styles.reservePriceRow}>
              <AppText style={styles.reserveCredits}>4</AppText>
              <AppText style={styles.reservePrice}>credits or $450</AppText>
            </View>
            <AppText muted style={styles.reserveMeta}>
              1 class · 1:30 hr · Start at {booking?.time ?? "--:--"} · {booking?.location ?? ""}
            </AppText>
          </View>
          <View style={styles.reserveActionRow}>
            <Pressable style={({ pressed }) => [styles.reserveButton, pressed && styles.pressed]}>
              <AppText style={styles.reserveButtonText}>Reserve</AppText>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.reserveAddButton, pressed && styles.pressed]}>
              <Plus color={semantic.textInverse} size={34} strokeWidth={2.4} />
            </Pressable>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semantic.bgApp,
    flex: 1,
  },
  content: {
    paddingBottom: spacing[16] + spacing[12],
  },
  hero: {
    height: 246,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[8],
    paddingHorizontal: spacing[7],
  },
  statusTime: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  statusIcons: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[2],
  },
  signalBars: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 3,
    height: 18,
  },
  signalBar: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    width: 4,
  },
  wifiMark: {
    borderColor: semantic.bgBase,
    borderRadius: 10,
    borderTopWidth: 4,
    height: 14,
    width: 22,
  },
  battery: {
    borderColor: semantic.bgBase,
    borderRadius: radius.sm,
    borderWidth: 2,
    height: 13,
    width: 28,
  },
  greetingCard: {
    alignItems: "center",
    backgroundColor: semantic.frostedDark,
    borderColor: semantic.frostedWhiteBorder,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 90,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    ...shadow.md,
  },
  greetingText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
    lineHeight: typography.size["2xl"] * 1.12,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  sections: {
    gap: spacing[6],
    marginTop: -32,
  },
  card: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    marginHorizontal: spacing[4],
    padding: spacing[4],
    ...shadow.lg,
  },
  quickCard: {
    paddingBottom: spacing[5],
  },
  sectionHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[3],
  },
  bigTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
    lineHeight: typography.size["2xl"] * 1.1,
  },
  seeMore: {
    backgroundColor: colors.neutral[100],
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  seeMoreDark: {
    backgroundColor: semantic.transparent,
  },
  seeMoreText: {
    color: colors.accent[600],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  seeMoreTextDark: {
    color: colors.accent[300],
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  quickTile: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: semantic.bgNavySubtle,
    borderRadius: radius.lg,
    flexBasis: "21.9%",
    flexGrow: 1,
    justifyContent: "center",
    maxWidth: "23%",
    minWidth: 68,
    padding: spacing[2],
  },
  quickLabel: {
    color: colors.neutral[800],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    lineHeight: typography.size.xs * 1.05,
    marginTop: spacing[2],
    textAlign: "center",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  wellnessHead: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wellnessTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl * 1.05,
  },
  arrowButton: {
    alignItems: "center",
    backgroundColor: colors.navy[700],
    borderRadius: radius.full,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  wellnessBody: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[4],
    marginTop: spacing[5],
  },
  donutWrap: {
    alignItems: "center",
    height: 140,
    justifyContent: "center",
    width: 140,
  },
  donutText: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    position: "absolute",
    width: 82,
  },
  donutNumber: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
    lineHeight: typography.size["2xl"] * 1.1,
  },
  donutTotal: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
  },
  donutUnit: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
    marginTop: -4,
    textAlign: "center",
    width: "100%",
  },
  tokenPanel: {
    flex: 1,
  },
  tokenTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
    marginBottom: spacing[2],
  },
  tokenBlocks: {
    flexDirection: "row",
    gap: 3,
    marginBottom: spacing[3],
  },
  tokenBlock: {
    backgroundColor: colors.neutral[200],
    borderRadius: radius.full,
    flex: 1,
    height: 16,
    maxWidth: 8,
    minWidth: 4,
  },
  legendList: {
    gap: spacing[1],
  },
  legendRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  legendDot: {
    borderRadius: radius.full,
    height: 14,
    width: 8,
  },
  legendLabel: {
    color: semantic.textPrimary,
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * 1.25,
  },
  legendValue: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  statsRow: {
    borderTopColor: colors.neutral[200],
    borderTopWidth: 1,
    flexDirection: "row",
    marginTop: spacing[5],
    paddingTop: spacing[3],
  },
  metric: {
    alignItems: "center",
    borderRightColor: colors.neutral[300],
    borderRightWidth: 1,
    flex: 1,
  },
  metricTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
  },
  metricValueRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  metricValue: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  metricUnit: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.micro,
    lineHeight: typography.size.micro * 1.2,
    textAlign: "center",
  },
  streakCard: {
    borderRadius: radius.lg,
    marginHorizontal: spacing[4],
    overflow: "hidden",
    padding: spacing[4],
    ...shadow.md,
  },
  streakHead: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  streakMonth: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  streakStats: {
    flexDirection: "row",
    gap: spacing[6],
    marginTop: spacing[2],
  },
  streakMeta: {
    color: semantic.whiteSoft,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
  },
  streakNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.md,
  },
  weekGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing[4],
  },
  weekLabel: {
    color: semantic.whiteMuted,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    textAlign: "center",
    width: 32,
  },
  calendarGrid: {
    gap: spacing[1],
    marginTop: spacing[2],
  },
  calendarGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCell: {
    alignItems: "center",
    height: 26,
    justifyContent: "center",
    width: 32,
  },
  dayCircle: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  dayEmpty: {
    backgroundColor: semantic.transparent,
  },
  levelPill: {
    backgroundColor: colors.navy[900],
    borderColor: semantic.frostedWhiteBorder,
    borderWidth: 1,
  },
  levelRing: {
    borderColor: semantic.whiteSoft,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 16,
    width: 16,
  },
  daySelected: {
    borderColor: colors.accent[400],
    borderWidth: 1,
  },
  dayText: {
    color: colors.neutral[800],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.micro,
  },
  section: {
    gap: spacing[1],
    marginHorizontal: spacing[4],
  },
  sectionTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  horizontalList: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  studioCard: {
    width: 220,
  },
  studioMedia: {
    borderRadius: radius.lg,
    height: 136,
    justifyContent: "space-between",
    overflow: "hidden",
    padding: spacing[2],
  },
  studioImage: {
    borderRadius: radius.lg,
  },
  imageFadeOverlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  ratingBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: semantic.ratingBadgeBg,
    borderRadius: radius.full,
    flexDirection: "row",
    gap: 2,
    paddingHorizontal: spacing[1],
    paddingVertical: 2,
  },
  ratingText: {
    color: colors.neutral[900],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.micro,
  },
  studioTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.05,
  },
  locationText: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.2,
    marginTop: spacing[2],
  },
  tagRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: spacing[1],
    marginTop: spacing[2],
  },
  miniTag: {
    alignItems: "center",
    borderColor: colors.navy[300],
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  miniTagText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.micro,
  },
  compactTag: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: colors.neutral[200],
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: 3,
    height: 22,
    maxWidth: 86,
    paddingHorizontal: spacing[1],
  },
  compactTagText: {
    color: colors.neutral[800],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.micro,
  },
  dodoRecommendedRow: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  dodoRecommendedCard: {
    width: 156,
  },
  dodoRecommendedMedia: {
    borderRadius: radius.lg,
    height: 118,
    overflow: "hidden",
    padding: spacing[2],
  },
  dodoRecommendedImage: {
    borderRadius: radius.lg,
  },
  dodoRecommendedTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.md,
    lineHeight: typography.size.md * typography.lineHeight.snug,
    marginTop: spacing[2],
  },
  promoCard: {
    width: 260,
  },
  promoMedia: {
    borderRadius: radius.lg,
    height: 132,
    justifyContent: "center",
    overflow: "hidden",
    padding: spacing[3],
  },
  promoImage: {
    borderRadius: radius.lg,
  },
  promoScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.overlay,
  },
  promoKicker: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  promoImageTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * 1.05,
  },
  promoAction: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.accent[100],
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing[1],
    marginTop: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  promoActionText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.micro,
  },
  promoTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
    marginTop: spacing[2],
  },
  promoSubtitle: {
    fontSize: typography.size.xs,
    lineHeight: typography.size.xs * 1.3,
  },
  planRow: {
    gap: spacing[4],
    paddingRight: spacing[4],
  },
  planCard: {
    borderRadius: radius.xl,
    minHeight: 420,
    padding: spacing[4],
    width: 236,
  },
  freePlan: {
    backgroundColor: semantic.bgBase,
    borderColor: colors.accent[400],
    borderWidth: 3,
  },
  paidPlan: {
    backgroundColor: colors.navy[700],
  },
  blackPlan: {
    backgroundColor: colors.navy[950],
  },
  planTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
  },
  paidText: {
    color: semantic.textInverse,
  },
  paidSubText: {
    color: semantic.whiteSoft,
  },
  planCopy: {
    color: colors.neutral[700],
    fontSize: typography.size.xs,
    lineHeight: typography.size.xs * 1.35,
    marginTop: spacing[1],
  },
  planDivider: {
    backgroundColor: colors.neutral[700],
    height: 1,
    marginVertical: spacing[3],
  },
  paidDivider: {
    backgroundColor: semantic.frostedWhiteBorder,
  },
  priceBlock: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  priceRow: {
    gap: spacing[2],
  },
  priceUnit: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  planPrice: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
  },
  planTokens: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  planIncludes: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  planBullet: {
    color: semantic.textPrimary,
    fontSize: typography.size.micro,
    lineHeight: typography.size.micro * 1.25,
  },
  planFooter: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: spacing[2],
    justifyContent: "flex-end",
    marginTop: spacing[4],
  },
  detailsText: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
    textAlign: "center",
  },
  paidDetailsText: {
    color: semantic.textInverse,
  },
  getButton: {
    alignItems: "center",
    backgroundColor: colors.accent[400],
    borderRadius: radius.full,
    height: 40,
    justifyContent: "center",
    paddingVertical: spacing[2],
    width: "100%",
    ...shadow.sm,
  },
  getButtonText: {
    color: semantic.textInverse,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  recommendedCard: {
    width: 150,
  },
  recommendedMedia: {
    height: 96,
    overflow: "hidden",
    padding: spacing[2],
  },
  recommendedImage: {
    borderRadius: radius.md,
  },
  recommendedTitle: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    marginTop: spacing[1],
  },
  recommendedPanel: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    marginHorizontal: -spacing[4],
    overflow: "hidden",
    paddingBottom: spacing[4],
    ...shadow.sm,
  },
  filterRow: {
    backgroundColor: semantic.bgBase,
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: colors.neutral[100],
    borderRadius: radius.full,
    height: 36,
    justifyContent: "center",
    width: 48,
    ...shadow.xs,
  },
  filterChip: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: colors.neutral[200],
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[1],
    height: 36,
    paddingHorizontal: spacing[3],
    ...shadow.xs,
  },
  filterLabel: {
    color: colors.neutral[700],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  recommendedList: {
    gap: spacing[4],
    paddingHorizontal: spacing[4],
  },
  recommendationItem: {
    borderBottomColor: colors.neutral[200],
    borderBottomWidth: 1,
    gap: spacing[2],
    paddingBottom: spacing[4],
  },
  recommendationTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing[3],
  },
  recommendationMedia: {
    borderRadius: radius.lg,
    flexShrink: 0,
    height: 116,
    minHeight: 116,
    minWidth: 116,
    overflow: "hidden",
    width: 116,
  },
  recommendationImage: {
    borderRadius: radius.lg,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing[2],
    justifyContent: "space-between",
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: semantic.frostedWhite,
    borderRadius: radius.full,
    borderColor: semantic.frostedWhiteBorder,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
    ...shadow.xs,
  },
  favoriteButtonActive: {
    backgroundColor: colors.neutral[200],
  },
  recommendationCopy: {
    flex: 1,
    gap: spacing[1],
  },
  recommendationTitle: {
    color: semantic.textPrimary,
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * typography.lineHeight.tight,
  },
  recommendationRating: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  recommendationMeta: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  recommendationLocation: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.snug,
  },
  recommendationTags: {
    gap: spacing[1],
    paddingTop: spacing[1],
  },
  classRows: {
    gap: spacing[2],
  },
  classBlock: {
    gap: spacing[1],
  },
  className: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
  },
  timeRow: {
    gap: spacing[2],
  },
  timePill: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderDefault,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    minWidth: 56,
    paddingHorizontal: spacing[2],
  },
  timePillSelected: {
    backgroundColor: colors.navy[700],
    borderColor: colors.navy[700],
  },
  passPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.neutral[200],
    borderRadius: radius.sm,
    height: 28,
    justifyContent: "center",
    paddingHorizontal: spacing[3],
  },
  timeText: {
    color: semantic.textSecondary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  timeTextSelected: {
    color: semantic.textInverse,
  },
  seeClassesButton: {
    alignItems: "center",
    backgroundColor: semantic.bgNavyMuted,
    borderRadius: radius.full,
    flexDirection: "row",
    gap: spacing[1],
    height: 38,
    justifyContent: "center",
    marginTop: spacing[2],
  },
  seeClassesButtonSelected: {
    backgroundColor: colors.navy[700],
  },
  seeClassesText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.thaiSemibold,
    fontSize: typography.size.base,
  },
  seeClassesTextSelected: {
    color: semantic.textInverse,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalClose: {
    alignItems: "center",
    backgroundColor: colors.neutral[700],
    borderRadius: radius.full,
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: spacing[3],
    top: spacing[5],
    width: 32,
    ...shadow.sm,
  },
  reserveSheet: {
    alignSelf: "center",
    backgroundColor: semantic.liquidGlass,
    borderColor: semantic.liquidGlassBorder,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing[3],
    marginBottom: spacing[8],
    overflow: "hidden",
    padding: spacing[6],
    width: "92%",
    ...shadow.lg,
  },
  reserveHandle: {
    alignSelf: "center",
    backgroundColor: colors.neutral[600],
    borderRadius: radius.full,
    height: 6,
    marginBottom: spacing[2],
    width: 78,
  },
  reserveCopy: {
    gap: spacing[1],
  },
  reservePriceRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing[3],
  },
  reserveCredits: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["3xl"] * 1.45,
    lineHeight: typography.size["3xl"] * 1.45,
  },
  reservePrice: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
    marginBottom: spacing[2],
  },
  reserveMeta: {
    fontSize: typography.size.md,
    lineHeight: typography.size.md * typography.lineHeight.snug,
  },
  reserveActionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
  },
  reserveButton: {
    alignItems: "center",
    backgroundColor: colors.navy[700],
    borderRadius: radius.full,
    flex: 1,
    height: 58,
    justifyContent: "center",
  },
  reserveButtonText: {
    color: semantic.textInverse,
    fontFamily: typography.fontFamily.thai,
    fontSize: typography.size["2xl"],
  },
  reserveAddButton: {
    alignItems: "center",
    backgroundColor: colors.navy[700],
    borderRadius: radius.full,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
});
