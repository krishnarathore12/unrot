import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.chipOutline,
    backgroundColor: "transparent",
    margin: Spacing.xs,
  },
  chipSelected: {
    backgroundColor: Colors.chipSelected,
    borderColor: Colors.chipSelected,
  },
  text: {
    ...Typography.chip,
    color: Colors.textSecondary,
  },
  textSelected: {
    color: Colors.chipSelectedText,
    fontWeight: "600",
  },
});
