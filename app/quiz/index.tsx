import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchQuiz } from "../../src/api/client";
import type { QuizCardData } from "../../src/components/QuizCard";
import { QuizCard } from "../../src/components/QuizCard";
import { Header } from "../../src/components/ui/Header";
import { useAuth } from "../../src/context/AuthContext";
import { Colors, Spacing, Typography } from "../../src/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = 80;
const LOCK_THRESHOLD = 10;
const PREFETCH_AT = 6; // start loading more when user reaches this card index

export default function QuizScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [cards, setCards] = useState<QuizCardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFetchingMore = useRef(false);

  const translateY = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const lockedDirection = useSharedValue(0);

  const loadQuiz = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuiz(token);
      setCards(data.cards);
      setCurrentIndex(0);
    } catch (err: any) {
      setError(err.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load more questions in the background
  const loadMoreQuestions = useCallback(async () => {
    if (!token || isFetchingMore.current) return;
    isFetchingMore.current = true;
    setLoadingMore(true);
    try {
      const data = await fetchQuiz(token);
      setCards((prev) => [
        ...prev,
        ...data.cards.map((c, i) => ({
          ...c,
          id: prev.length + i, // ensure unique IDs
        })),
      ]);
    } catch (err) {
      console.warn("Failed to load more questions:", err);
    } finally {
      setLoadingMore(false);
      isFetchingMore.current = false;
    }
  }, [token]);

  React.useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  // Auto-load more when approaching the end
  React.useEffect(() => {
    if (
      currentIndex >= cards.length - PREFETCH_AT &&
      cards.length > 0 &&
      !isFetchingMore.current
    ) {
      loadMoreQuestions();
    }
  }, [currentIndex, cards.length, loadMoreQuestions]);

  const goToNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, cards.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const openDetail = useCallback(() => {
    if (cards[currentIndex]) {
      router.push({
        pathname: "/quiz/detail",
        params: { cardData: JSON.stringify(cards[currentIndex]) },
      });
    }
  }, [currentIndex, cards, router]);

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onBegin(() => {
      lockedDirection.value = 0;
    })
    .onUpdate((e) => {
      if (lockedDirection.value === 0) {
        const absX = Math.abs(e.translationX);
        const absY = Math.abs(e.translationY);
        if (absX > LOCK_THRESHOLD || absY > LOCK_THRESHOLD) {
          lockedDirection.value = absY >= absX ? 1 : 2;
        }
        return;
      }

      if (lockedDirection.value === 1) {
        translateY.value = e.translationY * 0.35;
      } else if (lockedDirection.value === 2) {
        // Fade on both left and right horizontal swipes
        const absX = Math.abs(e.translationX);
        cardOpacity.value = 1 - Math.min(absX / 300, 0.6);
      }
    })
    .onEnd((e) => {
      if (lockedDirection.value === 1) {
        if (e.translationY < -SWIPE_THRESHOLD) {
          translateY.value = withTiming(
            -SCREEN_HEIGHT * 0.4,
            { duration: 200, easing: Easing.out(Easing.cubic) },
            () => {
              runOnJS(goToNext)();
              translateY.value = 0;
            },
          );
        } else if (e.translationY > SWIPE_THRESHOLD) {
          translateY.value = withTiming(
            SCREEN_HEIGHT * 0.4,
            { duration: 200, easing: Easing.out(Easing.cubic) },
            () => {
              runOnJS(goToPrev)();
              translateY.value = 0;
            },
          );
        } else {
          translateY.value = withTiming(0, {
            duration: 250,
            easing: Easing.out(Easing.cubic),
          });
        }
      } else if (lockedDirection.value === 2) {
        if (e.translationX < -SWIPE_THRESHOLD) {
          // Swipe left → open detail
          cardOpacity.value = withTiming(0, { duration: 150 }, () => {
            runOnJS(openDetail)();
            cardOpacity.value = 1;
          });
        } else if (e.translationX > SWIPE_THRESHOLD) {
          // Swipe right → go to previous card
          cardOpacity.value = withTiming(0, { duration: 150 }, () => {
            runOnJS(goToPrev)();
            cardOpacity.value = 1;
          });
        } else {
          cardOpacity.value = withTiming(1, { duration: 200 });
        }
      }

      lockedDirection.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: cardOpacity.value,
  }));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header userName={user?.name} onRefresh={loadQuiz} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={styles.loadingText}>Generating your quiz...</Text>
          <Text style={styles.loadingSubtext}>
            Fetching news & crafting questions with AI
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header userName={user?.name} onRefresh={loadQuiz} />
        <View style={styles.center}>
          <Text style={styles.errorText}>😵 {error}</Text>
          <Text style={styles.retryText} onPress={loadQuiz}>
            Tap to retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header userName={user?.name} onRefresh={loadQuiz} />
        <View style={styles.center}>
          <Text style={styles.errorText}>No quiz cards available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header userName={user?.name} onRefresh={loadQuiz} />

      <View style={styles.cardContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.animatedCard, animatedStyle]}>
            <QuizCard card={cards[currentIndex]} />
          </Animated.View>
        </GestureDetector>

        {/* Loading more indicator */}
        {loadingMore && (
          <View style={styles.loadingMoreBar}>
            <ActivityIndicator size="small" color={Colors.accent} />
            <Text style={styles.loadingMoreText}>
              Loading more questions...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  loadingText: {
    ...Typography.h2,
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  loadingSubtext: {
    ...Typography.body,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  errorText: {
    ...Typography.h2,
    textAlign: "center",
  },
  retryText: {
    ...Typography.body,
    color: Colors.accent,
    marginTop: Spacing.md,
  },
  cardContainer: {
    flex: 1,
    overflow: "hidden",
  },
  animatedCard: {
    flex: 1,
  },
  loadingMoreBar: {
    position: "absolute",
    bottom: Spacing.md,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.overlayDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 12,
  },
  loadingMoreText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 11,
  },
});
