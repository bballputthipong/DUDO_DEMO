import "../global.css";

import { BaiJamjuree_400Regular, BaiJamjuree_500Medium, BaiJamjuree_600SemiBold, BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from "@expo-google-fonts/figtree";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

import { AppProvider } from "@/src/providers/AppProvider";
import { semantic } from "@/src/theme/tokens";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    BaiJamjuree_400Regular,
    BaiJamjuree_500Medium,
    BaiJamjuree_600SemiBold,
    BaiJamjuree_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: semantic.bgApp },
          headerShown: false,
        }}
      >
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="activity/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="studio/[id]" options={{ presentation: "card" }} />
        <Stack.Screen name="gallery" options={{ presentation: "card" }} />
        <Stack.Screen name="reviews" options={{ presentation: "card" }} />
        <Stack.Screen name="booking/confirm" options={{ presentation: "modal" }} />
        <Stack.Screen name="booking/success" options={{ presentation: "modal" }} />
      </Stack>
    </AppProvider>
  );
}
