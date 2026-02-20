/**
 * API client for the Unrot backend.
 */

const BASE_URL = "https://unrot.onrender.com";

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
