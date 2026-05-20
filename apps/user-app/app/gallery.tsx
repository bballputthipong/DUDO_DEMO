import { router } from "expo-router";
import { ArrowLeft, ListFilter } from "lucide-react-native";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/src/components/AppText";
import { studioDemo } from "@/src/data/class-studio-demo";
import { webPhoneShell } from "@/src/theme/layout";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

const galleryTabs = ["Ice Bath Zone", "Sauna Rooms", "Recovery Lounge", "Studio Vibe"];

export default function GalleryScreen() {
  const [selectedTab, setSelectedTab] = useState<string>(galleryTabs[0] ?? "");
  return (
    <SafeAreaView style={[styles.root, webPhoneShell]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <ArrowLeft color={colors.navy[900]} size={26} />
          </Pressable>
          <AppText style={styles.title}>Gallery</AppText>
        </View>
        <ScrollView contentContainerStyle={styles.tabs} horizontal showsHorizontalScrollIndicator={false}>
          <Pressable style={styles.filterButton}>
            <ListFilter color={colors.navy[900]} size={22} />
          </Pressable>
          {galleryTabs.map((tab) => (
            <Pressable key={tab} onPress={() => setSelectedTab(tab)} style={[styles.tab, selectedTab === tab && styles.tabSelected]}>
              <AppText style={[styles.tabText, selectedTab === tab && styles.tabTextSelected]}>{tab}</AppText>
            </Pressable>
          ))}
        </ScrollView>

        <GallerySection title={selectedTab} images={studioDemo.gallery} />
        <GallerySection title="Sauna Rooms" images={[...studioDemo.gallery].reverse()} />
      </ScrollView>
    </SafeAreaView>
  );
}

function GallerySection({ images, title }: { images: readonly string[]; title: string }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
        <AppText style={styles.seeAll}>See all</AppText>
      </View>
      <View style={styles.masonry}>
        <Image source={{ uri: images[0] }} style={[styles.tile, styles.tileWide]} />
        <Image source={{ uri: images[1] }} style={[styles.tile, styles.tileTall]} />
        <Image source={{ uri: images[2] }} style={styles.tile} />
        <Image source={{ uri: images[3] }} style={styles.tile} />
        <Image source={{ uri: images[4] }} style={[styles.tile, styles.tileWide]} />
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
  tabs: {
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
  tab: {
    backgroundColor: colors.neutral[100],
    borderRadius: radius.full,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
  },
  tabSelected: {
    backgroundColor: colors.navy[700],
  },
  tabText: {
    color: semantic.textPrimary,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.sm,
  },
  tabTextSelected: {
    color: semantic.textInverse,
  },
  section: {
    gap: spacing[3],
  },
  sectionHead: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.navy[900],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
  },
  seeAll: {
    color: colors.navy[700],
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.sm,
  },
  masonry: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  tile: {
    borderRadius: radius.lg,
    height: 112,
    width: "48.8%",
  },
  tileWide: {
    width: "62%",
  },
  tileTall: {
    height: 232,
    width: "35.6%",
  },
});
