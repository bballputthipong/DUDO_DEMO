import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CalendarDays, ChevronRight, Heart, Star, Tag as TagIcon } from "lucide-react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View, PanResponder, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/src/components/AppText";
import { studioDateFilters, studioDemo } from "@/src/data/class-studio-demo";
import { webPhoneShell } from "@/src/theme/layout";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function ClassDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const fallbackClass = studioDemo.classes[0];
  const selectedClass = studioDemo.classes.find((item) => item.id === params.id) ?? fallbackClass;
  const [selectedDate, setSelectedDate] = useState<string>(studioDateFilters[0] ?? "");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.root, webPhoneShell]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: selectedClass.image }} style={styles.hero}>
          <View style={styles.heroShade} />
          <View style={styles.statusRow}>
            <AppText inverse style={styles.statusTime}>9:41</AppText>
            <View style={styles.statusDots}><View style={styles.statusDot} /><View style={styles.statusDot} /><View style={styles.statusDot} /></View>
          </View>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={semantic.textInverse} size={24} />
          </Pressable>
        </ImageBackground>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <AppText style={styles.screenTitle}>{selectedClass.title}</AppText>
              <View style={styles.metaRow}>
                <Star color={colors.accent[400]} fill={colors.accent[400]} size={16} />
                <AppText style={styles.metaStrong}>{selectedClass.rating}</AppText>
                <AppText muted>({selectedClass.reviews})</AppText>
                <AppText muted>·</AppText>
                <AppText muted>{studioDemo.price}</AppText>
                <AppText muted>·</AppText>
                <AppText muted>{studioDemo.location}</AppText>
                <AppText muted>·</AppText>
                <AppText muted>{studioDemo.distance}</AppText>
              </View>
            </View>
            <Pressable style={styles.heartButton}>
              <Heart color={colors.navy[900]} size={24} />
            </Pressable>
          </View>

          <TagRow tags={selectedClass.tags} />

          <ScrollView contentContainerStyle={styles.galleryStrip} horizontal showsHorizontalScrollIndicator={false}>
            {studioDemo.gallery.slice(0, 4).map((image) => (
              <Image key={image} source={{ uri: image }} style={styles.galleryImage} />
            ))}
          </ScrollView>

          <Pressable onPress={() => router.push("/studio/ice-house")} style={styles.studioCard}>
            <View style={styles.sectionHead}>
              <AppText style={styles.sectionTitle}>Studio</AppText>
              <ChevronRight color={colors.navy[700]} size={24} />
            </View>
            <View style={styles.studioCardRow}>
              <Image source={{ uri: studioDemo.gallery[2] ?? studioDemo.hero }} style={styles.studioImage} />
              <View style={styles.studioCopy}>
                <AppText style={styles.studioName}>{studioDemo.name}</AppText>
                <View style={styles.metaRow}>
                  <Star color={colors.accent[400]} fill={colors.accent[400]} size={14} />
                  <AppText style={styles.metaStrong}>{studioDemo.rating}</AppText>
                  <AppText muted>({studioDemo.reviews}) · {studioDemo.location} · {studioDemo.distance}</AppText>
                </View>
                <TagRow compact tags={studioDemo.tags.slice(0, 3)} />
              </View>
            </View>
          </Pressable>

          <View style={styles.scheduleCard}>
            <View style={styles.sectionHead}>
              <AppText style={styles.sectionTitle}>Schedule</AppText>
              <CalendarDays color={colors.navy[700]} size={24} />
            </View>
            <ScrollView contentContainerStyle={styles.dateRow} horizontal showsHorizontalScrollIndicator={false}>
              {studioDateFilters.map((date) => (
                <Capsule key={date} label={date} selected={selectedDate === date} onPress={() => setSelectedDate(date)} />
              ))}
            </ScrollView>
            <ScrollView contentContainerStyle={styles.timeRow} horizontal showsHorizontalScrollIndicator={false}>
              {selectedClass.times.map((time) => (
                <Capsule key={time} label={time} selected={selectedTime === time} onPress={() => setSelectedTime(time)} />
              ))}
            </ScrollView>
            <View style={styles.scheduleMetaRow}>
              <AppText muted>1 class</AppText>
              <AppText muted>·</AppText>
              <AppText muted>1:30 hr</AppText>
              <AppText muted>·</AppText>
              <AppText muted>{selectedClass.level}</AppText>
            </View>
          </View>

          <GalleryPreview />
          <ReviewPreview />
          <View style={styles.card}>
            <AppText style={styles.sectionTitle}>About</AppText>
            <AppText muted style={styles.bodyText}>
              Guided recovery session designed to reduce inflammation, boost recovery, and sharpen mental clarity. Perfect for all levels with expert guidance in a calm, supportive environment.
            </AppText>
            <TagRow tags={["Reduce Inflammation", "Boost Recovery", "Mental Clarity", "Beginner Friendly"]} />
          </View>

          <SectionTitle action="See all" title="Relevant Classes" />
          <ScrollView contentContainerStyle={styles.relevantRow} horizontal showsHorizontalScrollIndicator={false}>
            {studioDemo.classes.filter((item) => item.id !== selectedClass.id).map((item) => (
              <Pressable key={item.id} onPress={() => router.push(`/activity/${item.id}`)} style={styles.relevantCard}>
                <Image source={{ uri: item.image }} style={styles.relevantImage} />
                <AppText numberOfLines={1} style={styles.relevantTitle}>{item.title}</AppText>
                <AppText muted style={styles.relevantMeta}>{studioDemo.name}</AppText>
                <View style={styles.metaRow}>
                  <Star color={colors.accent[400]} fill={colors.accent[400]} size={12} />
                  <AppText style={styles.relevantMeta}>{item.rating}</AppText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <ReserveSheet selectedDate={selectedDate} selectedTime={selectedTime} onClose={() => setSelectedTime(null)} />
    </SafeAreaView>
  );
}

function Capsule({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.capsule, selected && styles.capsuleSelected, pressed && styles.pressed]}>
      <AppText style={[styles.capsuleText, selected && styles.capsuleTextSelected]}>{label}</AppText>
    </Pressable>
  );
}

function SectionTitle({ action, title }: { action?: string; title: string }) {
  return (
    <View style={styles.sectionHead}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {action ? (
        <Pressable onPress={() => router.push(title.includes("Review") ? "/reviews" : "/gallery")} style={styles.inlineAction}>
          <AppText style={styles.inlineActionText}>{action}</AppText>
          <ChevronRight color={colors.navy[700]} size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}

function TagRow({ compact = false, tags }: { compact?: boolean; tags: readonly string[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.tagRow, compact && styles.compactTagRow]} style={styles.tagRowWrapper}>
      {tags.map((tag, index) => (
        <View key={`${tag}-${index}`} style={[styles.tag, compact && styles.compactTag, tag === "Premium" && styles.premiumTag]}>
          <TagIcon color={compact ? colors.neutral[800] : colors.navy[700]} size={compact ? 12 : 14} strokeWidth={2} />
          <AppText style={[styles.tagText, compact && styles.compactTagText, tag === "Premium" && styles.premiumTagText]}>{tag}</AppText>
        </View>
      ))}
    </ScrollView>
  );
}

function GalleryPreview() {
  return (
    <View style={styles.card}>
      <SectionTitle action="See all" title="Gallery" />
      <ScrollView contentContainerStyle={styles.galleryStrip} horizontal showsHorizontalScrollIndicator={false}>
        {studioDemo.gallery.map((image) => (
          <Image key={image} source={{ uri: image }} style={styles.galleryThumb} />
        ))}
      </ScrollView>
    </View>
  );
}

function ReviewPreview() {
  const review = studioDemo.reviewsList[0];
  return (
    <View style={styles.card}>
      <SectionTitle action="See all" title="Rating & Review" />
      <View style={styles.reviewRow}>
        <View style={styles.ratingSummary}>
          <AppText style={styles.bigRating}>4.9</AppText>
          <View style={styles.starsRow}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} color={colors.accent[400]} fill={colors.accent[400]} size={15} />)}</View>
          <AppText muted>(128 reviews)</AppText>
        </View>
        <View style={styles.reviewMini}>
          <View style={styles.authorRow}>
            <Image source={{ uri: review.avatar }} style={styles.avatar} />
            <View>
              <AppText style={styles.studioName}>{review.name}</AppText>
              <AppText muted>{review.rating} · {review.date}</AppText>
            </View>
          </View>
          <AppText muted numberOfLines={2} style={styles.bodyText}>{review.text}</AppText>
        </View>
      </View>
    </View>
  );
}

const webClassName = (className: string) => (Platform.OS === "web" ? { className } : {});

function ReserveSheet({ selectedDate, selectedTime, onClose }: { selectedDate: string; selectedTime: string | null; onClose: () => void }) {
  const webPointerStartY = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || !selectedTime) {
      return;
    }
    const webDocument = (globalThis as { document?: { body?: { classList?: { add: (className: string) => void; remove: (className: string) => void } } } }).document;
    webDocument?.body?.classList?.add("reserve-sheet-open");
    return () => {
      webDocument?.body?.classList?.remove("reserve-sheet-open");
    };
  }, [selectedTime]);

  const dismissSheet = () => {
    if (isDismissing) {
      return;
    }
    if (Platform.OS === "web") {
      const webDocument = (globalThis as { document?: { body?: { classList?: { add: (className: string) => void; remove: (className: string) => void } } } }).document;
      webDocument?.body?.classList?.add("reserve-sheet-returning");
      setTimeout(() => {
        webDocument?.body?.classList?.remove("reserve-sheet-returning");
      }, 560);
    }
    setIsDismissing(true);
    setTimeout(() => {
      setIsDismissing(false);
      onClose();
    }, 220);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: (_, gesture) => gesture.dy > spacing[2] && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > spacing[2] && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > spacing[16] || gesture.vy > 0.75) {
            dismissSheet();
          }
        },
      }),
    [dismissSheet],
  );

  const webSwipeHandlers =
    Platform.OS === "web"
      ? {
          onPointerDown: (event: { clientY?: number; nativeEvent?: { clientY?: number } }) => {
            webPointerStartY.current = event.nativeEvent?.clientY ?? event.clientY ?? null;
          },
          onPointerUp: (event: { clientY?: number; nativeEvent?: { clientY?: number } }) => {
            const startY = webPointerStartY.current;
            const endY = event.nativeEvent?.clientY ?? event.clientY ?? startY;
            webPointerStartY.current = null;
            if (typeof startY === "number" && typeof endY === "number" && endY - startY > spacing[16]) {
              dismissSheet();
            }
          },
          onTouchStart: (event: { nativeEvent?: { touches?: Array<{ clientY?: number; pageY?: number }> } }) => {
            const touch = event.nativeEvent?.touches?.[0];
            touchStartY.current = touch?.clientY ?? touch?.pageY ?? null;
          },
          onTouchEnd: (event: { nativeEvent?: { changedTouches?: Array<{ clientY?: number; pageY?: number }> } }) => {
            const startY = touchStartY.current;
            const touch = event.nativeEvent?.changedTouches?.[0];
            const endY = touch?.clientY ?? touch?.pageY ?? startY;
            touchStartY.current = null;
            if (typeof startY === "number" && typeof endY === "number" && endY - startY > spacing[16]) {
              dismissSheet();
            }
          },
        }
      : {};

  if (!selectedTime) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.sheetHost}>
      <View
        {...webSwipeHandlers}
        {...webClassName(`liquid-glass-panel${isDismissing ? " dismiss" : ""}`)}
        style={styles.reserveSheet}
      >
        <View {...panResponder.panHandlers} {...webClassName("anim-stagger-1")} style={styles.reserveDragArea}>
          <View style={styles.reserveHandle} />
        </View>
        <View {...webClassName("anim-stagger-2")} style={styles.reserveCopy}>
          <View style={styles.reservePriceRow}>
            <AppText style={styles.reserveCredits}>{studioDemo.credits}</AppText>
            <AppText style={styles.reservePrice}>credits or {studioDemo.price}</AppText>
          </View>
          <AppText muted style={styles.reserveMeta} numberOfLines={1}>
            1 class · 1:30 hr · {selectedTime} · {selectedDate.replace("\n", " ")}
          </AppText>
        </View>
        <View {...webClassName("anim-stagger-3")} style={styles.reserveActionRow}>
          <Pressable style={({ pressed }) => [styles.reserveButton, pressed && styles.pressed]}>
            <AppText style={styles.reserveButtonText}>Schedule</AppText>
          </Pressable>
        </View>
      </View>
    </View>
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
    height: 228,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,20,41,0.22)",
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing[7],
    paddingTop: spacing[5],
  },
  statusTime: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  statusDots: {
    flexDirection: "row",
    gap: spacing[1],
  },
  statusDot: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    height: spacing[2],
    width: spacing[2],
  },
  backButton: {
    alignItems: "center",
    backgroundColor: semantic.frostedDark,
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    left: spacing[4],
    position: "absolute",
    top: spacing[12],
    width: 44,
  },
  body: {
    gap: spacing[4],
    padding: spacing[4],
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing[3],
  },
  titleBlock: {
    flex: 1,
    gap: spacing[1],
  },
  screenTitle: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
    lineHeight: typography.size["2xl"] * typography.lineHeight.tight,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  metaStrong: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  heartButton: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderSubtle,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
    ...shadow.xs,
  },
  tagRowWrapper: {
    flexGrow: 0,
  },
  tagRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[2],
  },
  compactTagRow: {
    gap: spacing[1],
  },
  tag: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderDefault,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  compactTag: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  premiumTag: {
    backgroundColor: colors.accent[50],
    borderColor: colors.accent[200],
  },
  tagText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  compactTagText: {
    fontSize: typography.size.xs,
  },
  premiumTagText: {
    color: colors.accent[700],
  },
  galleryStrip: {
    gap: spacing[2],
  },
  galleryImage: {
    borderRadius: radius.lg,
    height: 88,
    width: 134,
  },
  studioCard: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[4],
    ...shadow.xs,
  },
  studioCardRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
  },
  studioImage: {
    borderRadius: radius.md,
    height: 88,
    width: 112,
  },
  studioCopy: {
    flex: 1,
    gap: spacing[1],
  },
  studioName: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
  },
  scheduleCard: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[4],
    ...shadow.xs,
  },
  sectionHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  inlineAction: {
    alignItems: "center",
    flexDirection: "row",
  },
  inlineActionText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  dateRow: {
    gap: spacing[2],
  },
  timeRow: {
    gap: spacing[2],
  },
  capsule: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderDefault,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 36,
    minWidth: 72,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  capsuleSelected: {
    backgroundColor: colors.navy[700],
    borderColor: colors.navy[700],
  },
  capsuleText: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
    textAlign: "center",
  },
  capsuleTextSelected: {
    color: semantic.textInverse,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
  scheduleMetaRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  card: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[3],
    ...shadow.xs,
  },
  galleryThumb: {
    borderRadius: radius.md,
    height: 74,
    width: 112,
  },
  reviewRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  ratingSummary: {
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    borderRadius: radius.md,
    justifyContent: "center",
    padding: spacing[3],
    width: 112,
  },
  bigRating: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["3xl"],
  },
  starsRow: {
    flexDirection: "row",
    gap: 1,
  },
  reviewMini: {
    borderColor: semantic.borderSubtle,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing[2],
    padding: spacing[3],
  },
  authorRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[2],
  },
  avatar: {
    borderRadius: radius.full,
    height: 42,
    width: 42,
  },
  bodyText: {
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.snug,
  },
  relevantRow: {
    gap: spacing[3],
  },
  relevantCard: {
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    paddingBottom: spacing[2],
    width: 170,
  },
  relevantImage: {
    height: 88,
    width: "100%",
  },
  relevantTitle: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
    marginHorizontal: spacing[2],
    marginTop: spacing[2],
  },
  relevantMeta: {
    fontSize: typography.size.xs,
    marginHorizontal: spacing[2],
  },
  sheetHost: {
    alignItems: "center",
    bottom: spacing[2],
    left: 0,
    maxWidth: 390,
    paddingBottom: spacing[2],
    position: "absolute",
    right: 0,
    width: "100%",
    zIndex: 20,
  },
  reserveSheet: {
    alignSelf: "center",
    backgroundColor: semantic.liquidGlass,
    borderColor: semantic.liquidGlassBorder,
    borderRadius: radius.xl + spacing[2],
    borderWidth: 1,
    gap: spacing[3],
    overflow: "hidden",
    padding: spacing[5],
    width: "96%",
    maxWidth: 390 - spacing[4],
    ...shadow.lg,
  },
  reserveDragArea: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    marginTop: -spacing[2],
  },
  reserveHandle: {
    backgroundColor: colors.neutral[600],
    borderRadius: radius.full,
    height: 6,
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
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
});
