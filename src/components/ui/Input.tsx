import React from "react";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { Colors, Spacing, Typography } from "../../theme";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words";
  style?: ViewStyle;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  style,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
        selectionColor={Colors.white}
      />
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    ...Typography.h1,
    fontSize: 24,
    fontWeight: "400",
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 0,
  },
  underline: {
    height: 2,
    backgroundColor: Colors.white,
    width: "100%",
  },
});
