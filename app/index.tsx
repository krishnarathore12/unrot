import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../src/components/ui/Button";
import { PaginationDots } from "../src/components/ui/PaginationDots";
import { useAuth } from "../src/context/AuthContext";
import { Colors, Spacing, Typography } from "../src/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { isOnboarded } = useAuth();

  React.useEffect(() => {
    if (isOnboarded) {
      router.replace("/quiz");
    }
  }, [isOnboarded]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logo}>
          <View style={styles.logoInner} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>UNROT</Text>
          <Text style={styles.titleAccent}>YOUR MIND.</Text>
        </View>

        <Text style={styles.tagline}>
          Daily news, zero doomscrolling.{"\n"}
          Interactive stories designed for{"\n"}
          humans.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.push("/onboarding/name")}
        />
        <PaginationDots total={5} current={0} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  logoInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 5,
    borderColor: Colors.background,
  },
  titleBlock: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.hero,
    lineHeight: 48,
  },
  titleAccent: {
    ...Typography.heroAccent,
    lineHeight: 48,
  },
  tagline: {
    ...Typography.body,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
});
