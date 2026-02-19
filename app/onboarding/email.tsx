import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { PaginationDots } from "../../src/components/ui/PaginationDots";
import { useAuth } from "../../src/context/AuthContext";
import { Colors, Spacing, Typography } from "../../src/theme";

export default function EmailScreen() {
  const router = useRouter();
  const { onboardingData, setEmail } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>✉ CONTACT</Text>
        <Text style={styles.heading}>Where should we{"\n"}reach you?</Text>

        <Input
          value={onboardingData.email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginTop: Spacing.lg }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.push("/onboarding/apikey")}
          disabled={!onboardingData.email.includes("@")}
        />
        <PaginationDots total={5} current={2} />
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
  label: {
    ...Typography.label,
    marginBottom: Spacing.md,
  },
  heading: {
    ...Typography.h1,
    lineHeight: 40,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
});
