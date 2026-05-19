import { Redirect } from "expo-router";

import { useAuthStore } from "@/src/stores/auth-store";

export default function IndexRoute() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Redirect href="/(tabs)/explore" />;
  }

  return <Redirect href="/auth/welcome" />;
}
