import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useSignupMutation } from "@/src/api/hooks";
import { AppText } from "@/src/components/AppText";
import { Button } from "@/src/components/Button";
import { InputField } from "@/src/components/InputField";
import { Screen } from "@/src/components/Screen";
import { useAuthStore } from "@/src/stores/auth-store";
import { semantic, spacing } from "@/src/theme/tokens";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const setSession = useAuthStore((state) => state.setSession);
  const signupMutation = useSignupMutation();
  const canSubmit = name.trim().length > 1 && email.trim().length > 4;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Sign Up</AppText>
        <AppText muted>Create Accountforเริ่มUse wellness token Ofyour</AppText>
      </View>
      <View style={styles.form}>
        <InputField label="Name" placeholder="NameOfyour" value={name} onChangeText={setName} />
        <InputField autoCapitalize="none" keyboardType="email-address" label="Email" placeholder="you@company.com" value={email} onChangeText={setEmail} />
        <InputField keyboardType="phone-pad" label="เบอร์โทร" placeholder="0812345678" value={phone} onChangeText={setPhone} />

        {signupMutation.isError ? <AppText style={styles.error}>{signupMutation.error.message}</AppText> : null}

        <Button
          disabled={!canSubmit}
          fullWidth
          loading={signupMutation.isPending}
          size="lg"
          title={canSubmit ? "สมัครAndเข้าแอป" : "EnterInfoให้ครบ"}
          onPress={() => {
            signupMutation.mutate(
              { email, name, phone },
              {
                onSuccess: (session) => {
                  setSession(session);
                  router.replace("/(tabs)/explore");
                },
              },
            );
          }}
        />
        <Button fullWidth title="HasบัญชีDone" variant="ghost" onPress={() => router.push("/auth/login")} />
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
