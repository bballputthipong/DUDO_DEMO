import { router } from "expo-router";
import { ArrowLeft, CalendarDays, ChevronRight, Heart, ListFilter, MapPin, MessageCircle, Phone, Star, Tag as TagIcon } from "lucide-react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, View, PanResponder, Platform, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { AppText } from "@/src/components/AppText";
import { studioCategories, studioDateFilters, studioDemo } from "@/src/data/class-studio-demo";
import { webPhoneShell } from "@/src/theme/layout";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function StudioScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const screenWidth = Math.min(windowWidth, 390); // 390 is the max width from mobileLayout
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [mode, setMode] = useState<"main" | "detail">("main");
  const [selectedCategory, setSelectedCategory] = useState<string>(studioCategories[0] ?? "");
  const [selectedDate, setSelectedDate] = useState<string>(studioDateFilters[1] ?? "");
  const [selectedClassId, setSelectedClassId] = useState<string>(studioDemo.classes[0].id);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const selectedClass = studioDemo.classes.find((item) => item.id === selectedClassId) ?? studioDemo.classes[0];

  const handleSelectSlot = (classId: string, time: string) => {
    setSelectedClassId(classId);
    setSelectedTime(time);
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveHeroIndex(index);
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={[styles.root, webPhoneShell]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={StyleSheet.absoluteFill}
          >
            {mode === "main" ? (
              studioDemo.gallery.map((image, index) => (
                <View key={index} style={{ width: screenWidth, height: 220 }}>
                  <Image source={{ uri: image }} style={[StyleSheet.absoluteFill, styles.heroImage]} />
                  <View style={styles.heroShade} />
                </View>
              ))
            ) : (
              <View style={{ width: screenWidth, height: 220 }}>
                <Image source={{ uri: studioDemo.map }} style={[StyleSheet.absoluteFill, styles.heroImage]} />
                <View style={styles.heroShade} />
              </View>
            )}
          </ScrollView>

          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.statusRow}>
              <AppText inverse style={styles.statusTime}>
                9:41
              </AppText>
              <View style={styles.statusIcons}>
                <View style={styles.signalDot} />
                <View style={styles.signalDot} />
                <View style={styles.signalDot} />
              </View>
            </View>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={semantic.textInverse} size={24} />
            </Pressable>
            <View style={styles.segmented}>
              {(["main", "detail"] as const).map((item) => (
                <Pressable key={item} onPress={() => setMode(item)} style={[styles.segment, mode === item && styles.segmentActive]}>
                  <AppText style={[styles.segmentText, mode === item && styles.segmentTextActive]}>{item === "main" ? "Main" : "Detail"}</AppText>
                </Pressable>
              ))}
            </View>
            {mode === "main" ? (
              <View style={styles.heroDots}>
                {studioDemo.gallery.map((_, index) => (
                  <View key={index} style={activeHeroIndex === index ? styles.heroDotActive : styles.heroDot} />
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <AppText style={styles.screenTitle}>{studioDemo.name}</AppText>
              <View style={styles.metaRow}>
                <Star color={colors.accent[400]} fill={colors.accent[400]} size={16} />
                <AppText style={styles.metaStrong}>{studioDemo.rating}</AppText>
                <AppText muted>({studioDemo.reviews})</AppText>
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

          <TagRow tags={studioDemo.tags} />

          {mode === "main" ? (
            <>
              <ScrollView contentContainerStyle={styles.categoryRow} horizontal showsHorizontalScrollIndicator={false}>
                <Pressable style={styles.filterButton}>
                  <ListFilter color={colors.navy[900]} size={22} />
                </Pressable>
                {studioCategories.map((item) => (
                  <Capsule key={item} label={item} selected={selectedCategory === item} onPress={() => setSelectedCategory(item)} />
                ))}
              </ScrollView>

              <ScrollView contentContainerStyle={styles.dateRow} horizontal showsHorizontalScrollIndicator={false}>
                {studioDateFilters.map((item) => (
                  <Capsule key={item} label={item} selected={selectedDate === item} onPress={() => setSelectedDate(item)} />
                ))}
              </ScrollView>

              <SectionTitle title="Class Schedule" />
              <View style={styles.scheduleList}>
                {studioDemo.classes.map((item, index) => (
                  <View key={item.id} style={[styles.scheduleListItem, index === 0 && { paddingTop: 0 }]}>
                    {index > 0 && <View style={styles.listDivider} />}
                    <ScheduleCard item={item} selectedClassId={selectedClassId} selectedTime={selectedTime} onSelectSlot={handleSelectSlot} />
                  </View>
                ))}
              </View>
              <ReviewPreview />
            </>
          ) : (
            <>
              <GalleryPreview />
              <ReviewPreview />
              <View style={styles.infoCard}>
                <View style={styles.infoCopy}>
                  <AppText style={styles.sectionTitle}>About</AppText>
                  <AppText muted style={styles.bodyText}>
                    ICE HOUSE Recovery Lab is a premium wellness studio specializing in ice baths, sauna, and contrast therapy to help you recover, reset, and perform at your best.
                  </AppText>
                </View>
                <View style={styles.openCard}>
                  <CalendarDays color={colors.navy[700]} size={24} />
                  <AppText style={styles.openTitle}>Open today</AppText>
                  <AppText muted>06:00 - 22:00</AppText>
                </View>
              </View>
              <View style={styles.contactCard}>
                <View style={styles.contactActions}>
                  <SmallAction icon={<Phone color={colors.navy[700]} size={18} />} label="Call" />
                  <SmallAction icon={<MessageCircle color={colors.navy[700]} size={18} />} label="LINE" />
                </View>
                <View style={styles.addressCard}>
                  <MapPin color={colors.navy[700]} fill={colors.navy[700]} size={24} />
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.addressTitle}>{studioDemo.name}</AppText>
                    <AppText muted style={styles.bodyText}>392/1 Ekkamai Rd, Khlong Tan Nuea, Watthana, Bangkok 10110</AppText>
                  </View>
                  <ChevronRight color={colors.navy[700]} size={22} />
                </View>
              </View>
              <SectionTitle action="See all" onPress={() => router.push("/activity/guided-ice-bath")} title="Relevant Classes" />
              <ScrollView contentContainerStyle={styles.relevantRow} horizontal showsHorizontalScrollIndicator={false}>
                {studioDemo.classes.map((item) => (
                  <Pressable key={item.id} onPress={() => router.push(`/activity/${item.id}`)} style={styles.studioCard}>
                    <ImageBackground imageStyle={styles.studioImage} source={{ uri: item.image }} style={styles.studioMedia}>
                      <ImageFadeOverlay />
                      <View style={styles.ratingBadge}>
                        <Star color={colors.accent[400]} fill={colors.accent[400]} size={12} />
                        <AppText style={styles.ratingText}>{item.rating}</AppText>
                      </View>
                      <AppText inverse numberOfLines={2} style={styles.studioTitle}>
                        {item.title}
                      </AppText>
                    </ImageBackground>
                    <AppText muted numberOfLines={2} style={styles.locationText}>
                      {studioDemo.name}
                    </AppText>
                    <View style={styles.studioTagRow}>
                      {item.tags.slice(0, 2).map((tag) => (
                        <MiniTag key={tag} label={tag} />
                      ))}
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </ScrollView>

      {mode === "main" ? <ReserveSheet selectedClass={selectedClass.title} selectedDate={selectedDate} selectedTime={selectedTime} onClose={() => setSelectedTime(null)} /> : null}
    </SafeAreaView>
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

function MiniTag({ label }: { label: string }) {
  return (
    <View style={styles.miniTag}>
      <TagIcon color={colors.navy[700]} size={12} strokeWidth={2} />
      <AppText style={styles.miniTagText}>{label}</AppText>
    </View>
  );
}

function Capsule({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.capsule, selected && styles.capsuleSelected, pressed && styles.pressed]}>
      <AppText style={[styles.capsuleText, selected && styles.capsuleTextSelected]}>{label}</AppText>
    </Pressable>
  );
}

function SectionTitle({ action, onPress, title }: { action?: string; onPress?: () => void; title: string }) {
  return (
    <View style={styles.sectionHead}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {action ? (
        <Pressable onPress={onPress} style={styles.inlineAction}>
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
        <View key={tag} style={[styles.tag, compact && styles.compactTag, index === tags.length - 1 && tag === "Premium" && styles.premiumTag]}>
          <TagIcon color={compact ? colors.neutral[800] : colors.navy[700]} size={compact ? 12 : 14} strokeWidth={2} />
          <AppText style={[styles.tagText, compact && styles.compactTagText, index === tags.length - 1 && tag === "Premium" && styles.premiumTagText]}>{tag}</AppText>
        </View>
      ))}
    </ScrollView>
  );
}

function ScheduleCard({
  item,
  onSelectSlot,
  selectedClassId,
  selectedTime,
}: {
  item: (typeof studioDemo.classes)[number];
  onSelectSlot: (classId: string, time: string) => void;
  selectedClassId: string;
  selectedTime: string | null;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Pressable onPress={() => router.push(`/activity/${item.id}`)} style={styles.scheduleCard}>
      <View style={styles.scheduleTop}>
        <Image source={{ uri: item.image }} style={styles.scheduleImage} />
        <View style={styles.scheduleCopy}>
          <View style={styles.cardTitleRow}>
            <AppText numberOfLines={2} style={styles.scheduleTitle}>{item.title}</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isFavorite }}
              onPress={(event) => {
                event.stopPropagation();
                setIsFavorite((value) => !value);
              }}
              style={({ pressed }) => [styles.favoriteButton, isFavorite && styles.favoriteButtonActive, pressed && styles.pressed]}
            >
              <Heart color={isFavorite ? colors.accent[400] : colors.neutral[700]} fill={isFavorite ? colors.accent[400] : semantic.transparent} size={20} />
            </Pressable>
          </View>
          <View style={styles.metaRow}>
            <Star color={colors.accent[400]} fill={colors.accent[400]} size={14} />
            <AppText style={styles.metaStrong}>{item.rating}</AppText>
            <AppText muted>({item.reviews})</AppText>
            <AppText muted>· {studioDemo.price}</AppText>
          </View>
          <AppText muted>{studioDemo.location} · {studioDemo.distance}</AppText>
          <TagRow compact tags={item.tags.slice(0, 3)} />
        </View>
      </View>
      <View style={styles.scheduleBottom}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotRow} style={styles.slotRowWrapper}>
          {item.times.map((time) => (
            <Pressable
              key={time}
              onPress={(event) => {
                event.stopPropagation();
                onSelectSlot(item.id, time);
              }}
              style={[styles.timePill, selectedClassId === item.id && selectedTime === time && styles.timePillSelected]}
            >
              <AppText style={[styles.timeText, selectedClassId === item.id && selectedTime === time && styles.timeTextSelected]}>{time}</AppText>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.cardCredits}>
          <View style={styles.creditTopRow}>
            <AppText style={styles.creditNumber}>{studioDemo.credits}</AppText>
            <AppText style={styles.creditText}>credits</AppText>
          </View>
          <AppText muted style={styles.creditPriceText}>or {studioDemo.price}</AppText>
        </View>
      </View>
    </Pressable>
  );
}

function GalleryPreview() {
  return (
    <View style={styles.card}>
      <SectionTitle action="See all" onPress={() => router.push("/gallery")} title="Gallery" />
      <ScrollView contentContainerStyle={styles.galleryRow} horizontal showsHorizontalScrollIndicator={false}>
        {studioDemo.gallery.slice(0, 5).map((image) => (
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
      <SectionTitle action="See all" onPress={() => router.push("/reviews")} title="Rating & Review" />
      <View style={styles.reviewRow}>
        <View style={styles.ratingSummary}>
          <AppText style={styles.bigRating}>{studioDemo.rating}</AppText>
          <View style={styles.starsRow}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} color={colors.accent[400]} fill={colors.accent[400]} size={15} />)}</View>
          <AppText muted>({studioDemo.reviews} reviews)</AppText>
        </View>
        <View style={styles.reviewCardMini}>
          <View style={styles.reviewAuthor}>
            <Image source={{ uri: review.avatar }} style={styles.avatar} />
            <View>
              <AppText style={styles.addressTitle}>{review.name}</AppText>
              <AppText muted>{review.date}</AppText>
            </View>
          </View>
          <AppText muted numberOfLines={2} style={styles.bodyText}>{review.text}</AppText>
        </View>
      </View>
    </View>
  );
}

function SmallAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Pressable style={styles.smallAction}>
      {icon}
      <AppText style={styles.smallActionText}>{label}</AppText>
    </Pressable>
  );
}

const webClassName = (className: string) => (Platform.OS === "web" ? { className } : {});

function ReserveSheet({ selectedClass, selectedDate, selectedTime, onClose }: { selectedClass: string; selectedDate: string; selectedTime: string | null; onClose: () => void }) {
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
            1 class · {selectedTime} · {selectedDate.replace("\n", " ")} · {selectedClass}
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
    height: 220,
  },
  heroImage: {
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.overlay,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
  },
  statusTime: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
  },
  statusIcons: {
    flexDirection: "row",
    gap: spacing[1],
  },
  signalDot: {
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
  segmented: {
    alignItems: "center",
    borderColor: semantic.frostedWhiteBorder,
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    padding: spacing[1],
    position: "absolute",
    right: spacing[4],
    top: spacing[12],
  },
  segment: {
    borderRadius: radius.full,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
  },
  segmentActive: {
    backgroundColor: semantic.bgBase,
  },
  segmentText: {
    color: semantic.textInverse,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.base,
  },
  segmentTextActive: {
    color: colors.navy[900],
  },
  heroDots: {
    alignSelf: "center",
    backgroundColor: semantic.frostedWhite,
    borderRadius: radius.full,
    bottom: spacing[2],
    flexDirection: "row",
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    position: "absolute",
  },
  heroDot: {
    backgroundColor: colors.neutral[400],
    borderRadius: radius.full,
    height: 7,
    width: 7,
  },
  heroDotActive: {
    backgroundColor: colors.navy[700],
    borderRadius: radius.full,
    height: 7,
    width: 7,
  },
  body: {
    gap: spacing[4],
    padding: spacing[4],
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
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
    borderRadius: radius.full,
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
  categoryRow: {
    gap: spacing[2],
  },
  dateRow: {
    gap: spacing[2],
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.full,
    height: 44,
    justifyContent: "center",
    width: 52,
    ...shadow.xs,
  },
  capsule: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderColor: semantic.borderSubtle,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 88,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    ...shadow.xs,
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
    gap: spacing[1],
  },
  inlineActionText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.thaiSemibold,
    fontSize: typography.size.sm,
  },
  scheduleList: {
    paddingTop: spacing[2],
  },
  scheduleListItem: {
    gap: spacing[6],
    paddingTop: spacing[6],
  },
  listDivider: {
    backgroundColor: semantic.borderSubtle,
    height: 1,
    width: "100%",
  },
  scheduleCard: {
    gap: spacing[4],
  },
  scheduleTop: {
    flexDirection: "row",
    gap: spacing[3],
  },
  scheduleImage: {
    borderRadius: radius.md,
    height: 124,
    width: 114,
  },
  scheduleCopy: {
    flex: 1,
    gap: spacing[1],
  },
  cardTitleRow: {
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
  scheduleTitle: {
    color: semantic.textPrimary,
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.lg,
    lineHeight: typography.size.lg * typography.lineHeight.tight,
  },
  scheduleBottom: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  slotRowWrapper: {
    flex: 1,
  },
  slotRow: {
    alignItems: "center",
    flexDirection: "row",
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
  timeText: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.xs,
  },
  timeTextSelected: {
    color: semantic.textInverse,
  },
  cardCredits: {
    alignItems: "flex-end",
  },
  creditTopRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: spacing[1],
  },
  creditNumber: {
    color: colors.accent[500],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
  },
  creditText: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  creditPriceText: {
    fontSize: typography.size.sm,
  },
  card: {
    gap: spacing[3],
  },
  galleryRow: {
    gap: spacing[2],
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
  reviewCardMini: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.md,
    flex: 1,
    gap: spacing[2],
    padding: spacing[3],
    ...shadow.sm,
  },
  reviewAuthor: {
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
  infoCard: {
    flexDirection: "row",
    gap: spacing[3],
    paddingTop: spacing[4],
  },
  infoCopy: {
    flex: 1,
    gap: spacing[2],
  },
  openCard: {
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    borderRadius: radius.md,
    justifyContent: "center",
    padding: spacing[3],
    width: 128,
  },
  openTitle: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  contactCard: {
    gap: spacing[3],
    paddingTop: spacing[4],
  },
  contactActions: {
    flexDirection: "row",
    gap: spacing[2],
  },
  smallAction: {
    alignItems: "center",
    borderColor: semantic.borderSubtle,
    borderRadius: radius.full,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  smallActionText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  addressCard: {
    alignItems: "center",
    backgroundColor: colors.neutral[50],
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing[2],
    padding: spacing[3],
  },
  addressTitle: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  relevantRow: {
    gap: spacing[3],
  },
  relevantCard: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing[2],
    width: 170,
    ...shadow.lg,
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
  studioCard: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing[2],
    width: 170,
    ...shadow.lg,
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
    fontSize: typography.size.md,
    lineHeight: typography.size.md * 1.1,
  },
  locationText: {
    fontSize: typography.size.xs,
    lineHeight: typography.size.xs * 1.2,
    marginTop: spacing[2],
    marginHorizontal: spacing[2],
  },
  studioTagRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: spacing[1],
    marginTop: spacing[2],
    marginHorizontal: spacing[2],
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
