import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { PaginationDots } from "../../src/components/ui/PaginationDots";
import { useAuth } from "../../src/context/AuthContext";
import { Colors, Spacing, Typography } from "../../src/theme";

export default function ApiKeyScreen() {
  const router = useRouter();
  const { onboardingData, setGeminiApiKey } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>🔑 API ACCESS</Text>
        <Text style={styles.heading}>Your Gemini{"\n"}API key.</Text>
        <Text style={styles.subtitle}>
          We use Google's Gemini to generate your personalized quizzes. Your key
          stays on the server and is never shared.
        </Text>

        <Input
          value={onboardingData.geminiApiKey}
          onChangeText={setGeminiApiKey}
          placeholder="AIzaSy..."
          autoCapitalize="none"
          style={{ marginTop: Spacing.lg }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.push("/onboarding/interests")}
          disabled={onboardingData.geminiApiKey.length < 10}
        />
        <PaginationDots total={5} current={3} />
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
  subtitle: {
    ...Typography.body,
    marginTop: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
});
