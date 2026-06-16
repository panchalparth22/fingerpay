import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/env";
import { useNavigation } from "@react-navigation/native";
import AmountInput from "../components/AmountInput";
import PrimaryButton from "../components/PrimaryButton";

const PaymentScreen = () => {
  const { user, token, login, logout } = useAuth();
  const navigation = useNavigation();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refresh merchant data on mount (optional)
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/merchant/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.user) {
        // keep role from context, just refresh user + token
        login({ user: data.user, token, role: "merchant" });
      }
    } catch (e) {
      console.error("Failed to refresh merchant:", e);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  const handleCharge = async () => {
    const amountNum = parseFloat(amount);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/payments/merchant-charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amountNum,
          // later you might add description or reference here
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Charge failed");
      }

      // Update merchant balance in context
      if (data.user) {
        login({ user: data.user, token, role: "merchant" });
      }

      // Navigate to a result/receipt screen if you want
      navigation.navigate("PaymentResultScreen", {
        user: data.user,
        transaction: data.transaction,
      });
    } catch (err) {
      setError(err.message || "Charge failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintPress = () => {
    // TODO: later you can add biometric flow here
    // For now, this is intentionally empty as requested.
  };

  const merchantName = user?.merchant_name || user?.company_name || user?.name;
  const balanceDisplay = typeof user?.balance === "number"
    ? `£${user.balance.toFixed(2)}`
    : "£0.00";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Charge customer</Text>
        <Text style={styles.subtitle}>{merchantName}</Text>
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Current balance</Text>
        <Text style={styles.balanceAmount}>{balanceDisplay}</Text>
      </View>

      {/* Amount input */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Charge amount (£)</Text>
        <AmountInput
          label=""
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
        />
      </View>

      {/* Fingerprint button (no functionality yet) */}
      <TouchableOpacity
        style={styles.fingerprintButton}
        onPress={handleFingerprintPress}
        activeOpacity={0.9}
      >
        <Ionicons name="finger-print-outline" size={24} color="#f9fafb" />
        <Text style={styles.fingerprintText}>Pay by fingerprint</Text>
      </TouchableOpacity>

      {/* Confirm charge button */}
      <PrimaryButton
        style={{ marginTop: 16, backgroundColor: "#5b21b6" }}
        title="Confirm charge"
        onPress={handleCharge}
        loading={loading}
      />

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={{ marginTop: 24 }}>
        <Button title="Log out" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  balanceSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  fingerprintButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 8,
  },
  fingerprintText: {
    marginLeft: 8,
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "600",
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fef2f2",
    borderLeftWidth: 4,
    borderColor: "#dc2626",
    borderRadius: 4,
  },
  errorText: {
    color: "#b91c1c",
  },
});

export default PaymentScreen;