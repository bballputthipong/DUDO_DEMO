import { Platform, type ViewStyle } from "react-native";

export const mobileLayout = {
  maxWidth: 390,
  tabBarMaxWidth: 366,
} as const;

export const webPhoneShell: ViewStyle =
  Platform.OS === "web"
    ? {
        alignSelf: "center",
        maxWidth: mobileLayout.maxWidth,
        width: "100%",
      }
    : {};
