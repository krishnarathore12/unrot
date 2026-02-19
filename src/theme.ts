/**
 * Unrot Design Theme
 * Dark theme matching the wireframe aesthetic
 */

export const Colors = {
  background: "#000000",
  surface: "#111111",
  surfaceLight: "#1A1A1A",
  card: "#0D0D0D",
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "#999999",
  textMuted: "#666666",
  accent: "#4A9EFF",
  accentGreen: "#22C55E",
  border: "#333333",
  borderLight: "#444444",
  chipOutline: "#555555",
  chipSelected: "#FFFFFF",
  chipSelectedText: "#000000",
  overlay: "rgba(0,0,0,0.6)",
  overlayDark: "rgba(0,0,0,0.85)",
};

export const Typography = {
  hero: {
    fontSize: 42,
    fontWeight: "900" as const,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  heroAccent: {
    fontSize: 42,
    fontWeight: "900" as const,
    color: Colors.textMuted,
    letterSpacing: -1,
  },
  h1: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
  },
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  chip: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
