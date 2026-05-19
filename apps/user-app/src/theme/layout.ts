import { Platform, type ViewStyle } from "react-native";

export const mobileLayout = {
  maxWidth: 430,
  tabBarMaxWidth: 398,
} as const;

export const webPhoneShell: ViewStyle =
  Platform.OS === "web"
    ? {
        alignSelf: "center",
        maxWidth: mobileLayout.maxWidth,
        width: "100%",
      }
    : {};
