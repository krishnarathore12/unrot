import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderRadius, Colors, Spacing } from "../../theme";

interface HeaderProps {
  userName?: string;
  onRefresh?: () => void;
}

export function Header({ userName, onRefresh }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <View style={styles.logoInner} />
        </View>
        <Text style={styles.title}>UNROT</Text>
      </View>

      <View style={styles.right}>
        {onRefresh && (
          <TouchableOpacity onPress={onRefresh} style={styles.iconButton}>
            <Text style={styles.iconText}>↻</Text>
          </TouchableOpacity>
        )}
        {userName && (
          <View style={styles.userBadge}>
            <Text style={styles.userIcon}>☗</Text>
            <Text style={styles.userName}>{userName.toUpperCase()}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logoInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
    color: Colors.white,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userIcon: {
    fontSize: 14,
    color: Colors.white,
  },
  userName: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 1,
  },
});
