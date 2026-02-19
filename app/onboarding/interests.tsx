import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Chip } from "../../src/components/ui/Chip";
import { PaginationDots } from "../../src/components/ui/PaginationDots";
import { useAuth } from "../../src/context/AuthContext";
import { Colors, Spacing, Typography } from "../../src/theme";

const TOPICS = [
  "Technology",
  "Politics",
  "Climate",
  "Science",
  "Culture",
  "Economy",
  "Health",
  "Sports",
];

export default function InterestsScreen() {
  const router = useRouter();
  const { onboardingData, setInterests, completeOnboarding, isLoading } =
    useAuth();

  const toggleTopic = (topic: string) => {
    const current = onboardingData.interests;
    if (current.includes(topic)) {
      setInterests(current.filter((t) => t !== topic));
    } else {
      setInterests([...current, topic]);
    }
  };

  const handleSubmit = async () => {
    try {
      await completeOnboarding();
      router.replace("/quiz");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to register. Is the backend running?",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>INTERESTS</Text>
        <Text style={styles.heading}>Pick your{"\n"}curiosity.</Text>

        <View style={styles.chipGrid}>
          {TOPICS.map((topic) => (
            <Chip
              key={topic}
              label={topic}
              selected={onboardingData.interests.includes(topic)}
              onPress={() => toggleTopic(topic)}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Let's Go"
          onPress={handleSubmit}
          disabled={onboardingData.interests.length === 0}
          loading={isLoading}
        />
        <PaginationDots total={5} current={4} />
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
    marginBottom: Spacing.xl,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
});
