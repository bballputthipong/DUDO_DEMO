import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Home, Search, SquarePlus, UsersRound, User } from "lucide-react-native";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { mobileLayout } from "@/src/theme/layout";
import { colors, semantic, shadow, typography } from "@/src/theme/tokens";

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const frameWidth = Platform.OS === "web" ? mobileLayout.maxWidth : width;
  const tabBarWidth = Math.min(frameWidth - 32, mobileLayout.tabBarMaxWidth - 12);
  const tabBarLeft = Math.max((frameWidth - tabBarWidth) / 2, 16);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy[700],
        tabBarInactiveTintColor: semantic.textSecondary,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.thaiMedium,
          fontSize: typography.size.xs,
          lineHeight: typography.size.xs * 1.15,
          marginTop: -2,
        },
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarItemStyle: {
          alignItems: "center",
          borderRadius: 9999,
          justifyContent: "center",
          marginHorizontal: 1,
          paddingVertical: 2,
        },
        tabBarActiveBackgroundColor: semantic.transparent,
        tabBarBackground: () => <BlurView intensity={78} tint="light" style={styles.liquidGlass} />,
        tabBarStyle: {
          backgroundColor: semantic.liquidGlass,
          borderColor: semantic.liquidGlassBorder,
          borderTopWidth: 1,
          borderWidth: 1,
          borderRadius: 9999,
          bottom: 14,
          gap: 2,
          height: 86,
          left: tabBarLeft,
          paddingBottom: 12,
          paddingHorizontal: 10,
          paddingTop: 10,
          position: "absolute",
          right: undefined,
          width: tabBarWidth,
          ...(Platform.OS === "web" ? { backdropFilter: "blur(24px) saturate(1.45)" } : {}),
          ...shadow.lg,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} fill={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Search color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Activities",
          tabBarIcon: ({ color }) => <SquarePlus color={color} fill={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => <UsersRound color={color} fill={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} fill={color} size={30} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  liquidGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semantic.liquidGlass,
    borderRadius: 9999,
    overflow: "hidden",
  },
});
