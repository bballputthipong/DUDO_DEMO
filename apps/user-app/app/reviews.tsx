import { router } from "expo-router";
import { ArrowLeft, Heart, Star } from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/src/components/AppText";
import { studioDemo } from "@/src/data/class-studio-demo";
import { webPhoneShell } from "@/src/theme/layout";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function ReviewsScreen() {
  return (
    <SafeAreaView style={[styles.root, webPhoneShell]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={colors.navy[900]} size={26} />
          </Pressable>
          <AppText style={styles.title}>Rating & Review</AppText>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.scoreBlock}>
            <AppText style={styles.score}>{studioDemo.rating}</AppText>
            <Stars />
            <AppText muted>({studioDemo.reviews}) reviews</AppText>
          </View>
          <View style={styles.bars}>
            {["5", "4", "3", "2", "1"].map((label, index) => {
              const percentage = [78, 16, 4, 1, 1][index] ?? 0;
              return (
                <View key={label} style={styles.barRow}>
                  <AppText style={styles.barLabel}>{label}</AppText>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${percentage}%` }]} />
                  </View>
                  <AppText muted style={styles.barPercent}>{percentage}%</AppText>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.tagRow}>
          {studioDemo.tags.map((tag) => (
            <View key={tag} style={[styles.tag, tag === "Premium" && styles.premiumTag]}>
              <AppText style={[styles.tagText, tag === "Premium" && styles.premiumTagText]}>{tag}</AppText>
            </View>
          ))}
        </View>

        {studioDemo.reviewsList.map((review, index) => (
          <View key={review.name} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Image source={{ uri: review.avatar }} style={styles.avatar} />
              <View style={styles.reviewCopy}>
                <AppText style={styles.reviewName}>{review.name}</AppText>
                <AppText muted>{review.count}</AppText>
                <View style={styles.reviewRating}>
                  <Stars small />
                  <AppText style={styles.reviewScore}>{review.rating}</AppText>
                  <AppText muted>· {review.date}</AppText>
                </View>
              </View>
              <Heart color={colors.navy[900]} size={24} />
            </View>
            <AppText style={styles.reviewText}>{review.text}</AppText>
            {(() => {
              const bookedClass = studioDemo.classes[index % studioDemo.classes.length] ?? studioDemo.classes[0];
              return (
                <View style={styles.bookedCard}>
                  <Image source={{ uri: bookedClass.image }} style={styles.bookedImage} />
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.bookedTitle}>{bookedClass.title}</AppText>
                    <AppText muted>{bookedClass.tags[0] ?? ""}</AppText>
                  </View>
                  <AppText style={styles.bookedCredit}>{studioDemo.credits} credits</AppText>
                </View>
              );
            })()}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stars({ small = false }: { small?: boolean }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} color={colors.accent[400]} fill={colors.accent[400]} size={small ? 13 : 18} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: semantic.bgApp,
    flex: 1,
  },
  content: {
    gap: spacing[4],
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  iconButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  title: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
  },
  summaryCard: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    flexDirection: "row",
    gap: spacing[4],
    padding: spacing[4],
    ...shadow.lg,
  },
  scoreBlock: {
    alignItems: "center",
    justifyContent: "center",
    width: 112,
  },
  score: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["3xl"] * 1.25,
    lineHeight: typography.size["3xl"] * 1.25,
  },
  stars: {
    flexDirection: "row",
    gap: 1,
  },
  bars: {
    flex: 1,
    gap: spacing[2],
  },
  barRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[2],
  },
  barLabel: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.medium,
    width: 12,
  },
  barTrack: {
    backgroundColor: colors.neutral[100],
    borderRadius: radius.full,
    flex: 1,
    height: 8,
  },
  barFill: {
    backgroundColor: colors.accent[400],
    borderRadius: radius.full,
    height: "100%",
  },
  barPercent: {
    fontSize: typography.size.xs,
    width: 34,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  tag: {
    backgroundColor: colors.navy[50],
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  premiumTag: {
    backgroundColor: colors.accent[50],
  },
  tagText: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xs,
  },
  premiumTagText: {
    color: colors.accent[700],
  },
  reviewCard: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    gap: spacing[3],
    padding: spacing[4],
    ...shadow.lg,
  },
  reviewTop: {
    flexDirection: "row",
    gap: spacing[3],
  },
  avatar: {
    borderRadius: radius.full,
    height: 64,
    width: 64,
  },
  reviewCopy: {
    flex: 1,
    gap: spacing[1],
  },
  reviewName: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.base,
  },
  reviewRating: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  reviewScore: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
  },
  reviewText: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.base,
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.snug,
  },
  bookedCard: {
    alignItems: "center",
    backgroundColor: semantic.bgBase,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing[2],
    padding: spacing[2],
    ...shadow.xs,
  },
  bookedImage: {
    borderRadius: radius.sm,
    height: 44,
    width: 64,
  },
  bookedTitle: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  bookedCredit: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
});
