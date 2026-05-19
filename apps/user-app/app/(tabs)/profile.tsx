import { router } from "expo-router";
import { Bell, Building2, ShieldCheck } from "lucide-react-native";
import { type ReactNode } from "react";
import { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { Screen } from "@/src/components/Screen";
import { Tag } from "@/src/components/Tag";
import { useAuthStore } from "@/src/stores/auth-store";
import { colors, radius, semantic, shadow, spacing, typography } from "@/src/theme/tokens";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [corporate, setCorporate] = useState(true);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <AppText inverse style={styles.avatarText}>
            {(user?.name ?? "D").slice(0, 1).toUpperCase()}
          </AppText>
        </View>
        <View style={styles.headerCopy}>
          <AppText variant="h1">{user?.name ?? "DUDO Member"}</AppText>
          <AppText muted>{user?.email ?? "member@dudo.app"}</AppText>
          <Tag dot label={user?.isVerified ? "Verified" : "OTP pending"} variant={user?.isVerified ? "navy" : "accent"} />
        </View>
      </View>

      <View style={styles.card}>
        <SettingRow
          description="รับ reminder BeforeClassเริ่ม"
          icon={<Bell color={colors.navy[700]} size={20} />}
          label="Notifications"
          value={notifications}
          onChange={setNotifications}
        />
        <SettingRow
          description="เNameมสิทธิ์ wellness benefit Ofบริษัท"
          icon={<Building2 color={colors.navy[700]} size={20} />}
          label="Corporate benefits"
          value={corporate}
          onChange={setCorporate}
        />
        <SettingRow
          description="InfoActivityOfyourจะNotแสดงรายบุคคลIn HR dashboard"
          icon={<ShieldCheck color={colors.navy[700]} size={20} />}
          label="Privacy-safe analytics"
          value
          disabled
          onChange={() => undefined}
        />
      </View>

      <Button
        fullWidth
        title="Sign Out"
        variant="secondary"
        onPress={() => {
          clearSession();
          router.replace("/auth/welcome");
        }}
      />
    </Screen>
  );
}

interface SettingRowProps {
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function SettingRow({ description, disabled = false, icon, label, onChange, value }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.settingCopy}>
        <AppText variant="title">{label}</AppText>
        <AppText muted style={styles.settingDescription}>
          {description}
        </AppText>
      </View>
      <Switch
        disabled={disabled}
        ios_backgroundColor={colors.neutral[200]}
        thumbColor={semantic.bgBase}
        trackColor={{ false: colors.neutral[200], true: colors.navy[700] }}
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.navy[700],
    borderRadius: radius.full,
    height: 72,
    justifyContent: "center",
    width: 72,
    ...shadow.sm,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size["2xl"],
  },
  headerCopy: {
    alignItems: "flex-start",
    flex: 1,
    gap: spacing[1],
  },
  card: {
    backgroundColor: semantic.bgBase,
    borderRadius: radius.lg,
    gap: spacing[4],
    marginBottom: spacing[6],
    padding: spacing[4],
    ...shadow.sm,
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: semantic.bgNavyMuted,
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  settingCopy: {
    flex: 1,
  },
  settingDescription: {
    fontSize: typography.size.xs,
  },
});
