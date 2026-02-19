import React, { createContext, ReactNode, useContext, useState } from "react";
import { AuthResponse, registerUser } from "../api/client";

interface OnboardingData {
  name: string;
  email: string;
  interests: string[];
  geminiApiKey: string;
}

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  onboardingData: OnboardingData;
  isOnboarded: boolean;
  isLoading: boolean;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setInterests: (interests: string[]) => void;
  setGeminiApiKey: (key: string) => void;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: "",
    email: "",
    interests: [],
    geminiApiKey: "",
  });

  const setName = (name: string) =>
    setOnboardingData((prev) => ({ ...prev, name }));
  const setEmail = (email: string) =>
    setOnboardingData((prev) => ({ ...prev, email }));
  const setInterests = (interests: string[]) =>
    setOnboardingData((prev) => ({ ...prev, interests }));
  const setGeminiApiKey = (key: string) =>
    setOnboardingData((prev) => ({ ...prev, geminiApiKey: key }));

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const result = await registerUser({
        name: onboardingData.name,
        email: onboardingData.email,
        interests: onboardingData.interests,
        gemini_api_key: onboardingData.geminiApiKey,
      });
      setUser(result);
      setToken(result.token);
    } finally {
      setIsLoading(false);
    }
  };

  const isOnboarded = token !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        onboardingData,
        isOnboarded,
        isLoading,
        setName,
        setEmail,
        setInterests,
        setGeminiApiKey,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
