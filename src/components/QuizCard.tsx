import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BorderRadius, Colors, Spacing, Typography } from "../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface QuizCardData {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  source_name: string;
  source_url: string;
  image_url: string | null;
}

interface QuizCardProps {
  card: QuizCardData;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function QuizCard({ card }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === card.correct_answer;

  // Reset selection when card changes
  React.useEffect(() => {
    setSelectedAnswer(null);
  }, [card.id]);

  const getOptionStyle = (index: number) => {
    if (!hasAnswered) return styles.option;
    if (index === card.correct_answer)
      return [styles.option, styles.optionCorrect];
    if (index === selectedAnswer && !isCorrect)
      return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDimmed];
  };

  const getOptionTextStyle = (index: number) => {
    if (!hasAnswered) return styles.optionText;
    if (index === card.correct_answer)
      return [styles.optionText, styles.optionTextCorrect];
    if (index === selectedAnswer && !isCorrect)
      return [styles.optionText, styles.optionTextWrong];
    return [styles.optionText, styles.optionTextDimmed];
  };

  const getLetterStyle = (index: number) => {
    if (!hasAnswered) return styles.letterCircle;
    if (index === card.correct_answer)
      return [styles.letterCircle, styles.letterCorrect];
    if (index === selectedAnswer && !isCorrect)
      return [styles.letterCircle, styles.letterWrong];
    return [styles.letterCircle, styles.letterDimmed];
  };

  const hasImage = card.image_url && card.image_url.length > 0;

  const content = (
    <>
      {/* Topic badge */}
      <View style={styles.topicBadge}>
        <Text style={styles.topicText}>{card.topic}</Text>
      </View>

      {/* Question */}
      <Text style={styles.question}>{card.question}</Text>

      {/* Answer options */}
      <View style={styles.optionsContainer}>
        {card.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(index)}
            onPress={() => {
              if (!hasAnswered) {
                setSelectedAnswer(index);
              }
            }}
            activeOpacity={hasAnswered ? 1 : 0.7}
            disabled={hasAnswered}
          >
            <View style={getLetterStyle(index)}>
              <Text style={styles.letterText}>
                {hasAnswered && index === card.correct_answer
                  ? "✓"
                  : hasAnswered && index === selectedAnswer && !isCorrect
                    ? "✗"
                    : OPTION_LETTERS[index]}
              </Text>
            </View>
            <Text style={getOptionTextStyle(index)} numberOfLines={3}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback after answering */}
      {hasAnswered && (
        <View
          style={[
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {isCorrect ? "🎉 Correct!" : "❌ Incorrect"}
          </Text>
          {card.explanation ? (
            <Text style={styles.feedbackText}>{card.explanation}</Text>
          ) : null}
        </View>
      )}

      {/* Swipe hint */}
      {hasAnswered && (
        <View style={styles.swipeHint}>
          <Text style={styles.swipeHintText}>↑ SWIPE UP FOR NEXT</Text>
        </View>
      )}
    </>
  );

  if (hasImage) {
    return (
      <ImageBackground
        source={{ uri: card.image_url! }}
        style={styles.card}
        imageStyle={styles.bgImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.75)", "rgba(0,0,0,0.92)", "rgba(0,0,0,0.98)"]}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </ImageBackground>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgImage: {
    resizeMode: "cover",
  },
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    justifyContent: "center",
  },
  topicBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: Spacing.lg,
  },
  topicText: {
    ...Typography.label,
    color: Colors.accent,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  question: {
    ...Typography.h1,
    fontSize: 22,
    lineHeight: 30,
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.sm + 2,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17,17,17,0.85)",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
  },
  optionCorrect: {
    borderColor: "#22C55E",
    backgroundColor: "rgba(34, 197, 94, 0.15)",
  },
  optionWrong: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  optionDimmed: {
    opacity: 0.4,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  letterCorrect: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  letterWrong: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  letterDimmed: {
    opacity: 0.4,
  },
  letterText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  optionText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  optionTextCorrect: {
    color: "#22C55E",
    fontWeight: "600",
  },
  optionTextWrong: {
    color: "#EF4444",
  },
  optionTextDimmed: {
    color: Colors.textMuted,
  },
  feedback: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  feedbackCorrect: {
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderColor: "rgba(34, 197, 94, 0.25)",
  },
  feedbackWrong: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  feedbackTitle: {
    ...Typography.h2,
    fontSize: 16,
    marginBottom: 4,
  },
  feedbackText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  swipeHint: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  swipeHintText: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
});
