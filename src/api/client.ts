/**
 * API client for the Unrot backend.
 */

import Constants from "expo-constants";
import { Platform } from "react-native";

// Physical devices need the machine's LAN IP.
// Expo provides the debuggerHost (e.g. "192.170.11.136:8081") which we can reuse.
const getBaseUrl = () => {
  // Get host IP from Expo's debuggerHost
  const debuggerHost =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  const hostIp = debuggerHost?.split(":")[0];

  if (hostIp) {
    return `http://${hostIp}:8000`;
  }

  // Fallback for Android emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  return "http://localhost:8000";
};

const BASE_URL = getBaseUrl();

interface RegisterParams {
  name: string;
  email: string;
  interests: string[];
  gemini_api_key: string;
}

interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

interface QuizCard {
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

interface QuizResponse {
  cards: QuizCard[];
}

export async function registerUser(
  params: RegisterParams,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Registration failed: ${err}`);
  }

  return res.json();
}

export async function fetchQuiz(token: string): Promise<QuizResponse> {
  const res = await fetch(`${BASE_URL}/api/quiz?token=${token}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Quiz fetch failed: ${err}`);
  }

  return res.json();
}

export type { AuthResponse, QuizCard, QuizResponse, RegisterParams };
