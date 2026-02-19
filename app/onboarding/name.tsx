import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Input } from "../../src/components/ui/Input";
import { PaginationDots } from "../../src/components/ui/PaginationDots";
import { useAuth } from "../../src/context/AuthContext";
import { Colors, Spacing, Typography } from "../../src/theme";

export default function NameScreen() {
  const router = useRouter();
  const { onboardingData, setName } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>SETUP</Text>
        <Text style={styles.heading}>Who are we{"\n"}addressing?</Text>

        <Input
          value={onboardingData.name}
          onChangeText={setName}
          placeholder="Krishna"
          autoCapitalize="words"
          style={{ marginTop: Spacing.lg }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => router.push("/onboarding/email")}
          disabled={!onboardingData.name.trim()}
        />
        <PaginationDots total={5} current={1} />
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
