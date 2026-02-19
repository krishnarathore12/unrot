import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";
import { BorderRadius, Colors, Spacing, Typography } from "../../src/theme";

export default function DetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cardData } = useLocalSearchParams<{ cardData: string }>();

  const card = React.useMemo(() => {
    try {
      return JSON.parse(cardData || "{}");
    } catch {
      return null;
    }
  }, [cardData]);

  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: Colors.white, padding: 20 }}>No card data</Text>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Quiz Question: ${card.question}\n\nAnswer: ${card.options?.[card.correct_answer]}\n\n${card.explanation}`,
        title: "Unrot Quiz",
      });
    } catch {}
  };

  const handleOpenSource = () => {
    if (card.source_url) {
      Linking.openURL(card.source_url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topic */}
        <Text style={styles.topic}>{card.topic?.toUpperCase()}</Text>

        {/* Question */}
        <Text style={styles.question}>{card.question}</Text>

        {/* Correct Answer */}
        <View style={styles.answerSection}>
          <Text style={styles.answerLabel}>CORRECT ANSWER</Text>
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>
              {card.options?.[card.correct_answer]}
            </Text>
          </View>
        </View>

        {/* Explanation */}
        {card.explanation ? (
          <View style={styles.explanationSection}>
            <Text style={styles.explanationLabel}>EXPLANATION</Text>
            <Text style={styles.explanationText}>{card.explanation}</Text>
          </View>
        ) : null}

        {/* Source */}
        {card.source_name && (
          <View style={styles.sourceRow}>
            <Text style={styles.sourceLabel}>Source: </Text>
            <TouchableOpacity onPress={handleOpenSource}>
              <Text style={styles.sourceName}>{card.source_name}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionButtonText}>↗ SHARE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.backBtn]}
          onPress={() => router.back()}
        >
          <Text style={styles.actionButtonText}>← BACK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  topic: {
    ...Typography.label,
    color: Colors.accent,
    marginBottom: Spacing.sm,
  },
  question: {
    ...Typography.h1,
    fontSize: 26,
    lineHeight: 34,
    marginBottom: Spacing.xl,
  },
  answerSection: {
    marginBottom: Spacing.xl,
  },
  answerLabel: {
    ...Typography.label,
    color: "#22C55E",
    marginBottom: Spacing.sm,
  },
  answerBox: {
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.25)",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  answerText: {
    ...Typography.body,
    color: "#22C55E",
    fontWeight: "600",
    fontSize: 17,
  },
  explanationSection: {
    marginBottom: Spacing.xl,
  },
  explanationLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  explanationText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sourceLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  sourceName: {
    ...Typography.bodySmall,
    color: Colors.accent,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtn: {
    borderColor: Colors.accent,
  },
  actionButtonText: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
