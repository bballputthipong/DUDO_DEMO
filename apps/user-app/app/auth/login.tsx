import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useLoginMutation } from "@/src/api/hooks";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { InputField } from "@/src/components/InputField";
import { Screen } from "@/src/components/Screen";
import { useAuthStore } from "@/src/stores/auth-store";
import { semantic, spacing } from "@/src/theme/tokens";

export default function LoginScreen() {
  const [target, setTarget] = useState("");
  const [otp, setOtp] = useState("");
  const setSession = useAuthStore((state) => state.setSession);
  const loginMutation = useLoginMutation();

  const canSubmit = target.trim().length > 2 && otp.trim().length >= 4;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Sign In</AppText>
        <AppText muted>Enter your email or phone with OTP to sign in</AppText>
      </View>

      <View style={styles.form}>
        <InputField
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email or Phone"
          placeholder="you@company.com"
          value={target}
          onChangeText={setTarget}
        />
        <InputField keyboardType="number-pad" label="OTP" maxLength={6} placeholder="123456" value={otp} onChangeText={setOtp} />

        {loginMutation.isError ? <AppText style={styles.error}>{loginMutation.error.message}</AppText> : null}

        <Button
          disabled={!canSubmit}
          fullWidth
          loading={loginMutation.isPending}
          size="lg"
          title={canSubmit ? "Verify and Enter" : "Fill in all fields"}
          onPress={() => {
            loginMutation.mutate(
              { target, otp },
              {
                onSuccess: (session) => {
                  setSession(session);
                  router.replace("/(tabs)/explore");
                },
              },
            );
          }}
        />
        <Button fullWidth title="Don't have an account?" variant="ghost" onPress={() => router.push("/auth/signup")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[8],
  },
  form: {
    gap: spacing[4],
  },
  error: {
    color: semantic.borderError,
  },
});
