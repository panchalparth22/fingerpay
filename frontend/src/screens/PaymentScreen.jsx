import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
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

  const handleAmountChange = (text) => {
    // 1) Remove everything except digits and dot
    let cleaned = text.replace(/[^0-9.]/g, "");

    // 2) Only allow a single dot
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts[1];
    }

    // 3) Limit to 2 digits after decimal
    if (parts.length === 2) {
      const integerPart = parts[0];
      const decimalPart = parts[1].slice(0, 2); // max 2 digits
      cleaned = integerPart + "." + decimalPart;
    }

    setAmount(cleaned);
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
  const companyName = user?.company_name;
  const balanceDisplay =
    typeof user?.balance === "number" ? `£${user.balance.toFixed(2)}` : "£0.00";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.title, { color: "#5b21b6" }]}>Finger</Text>
          <Text style={styles.title}>Pay</Text>
        </View>
        <Text style={styles.subtitle}>{companyName}</Text>
      </View>

      <Image source={require("../../assets/logo.png")} style={styles.logo} />

      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Amount</Text>

        <View style={styles.balanceAmountWrapper}>
          <Text style={styles.balanceCurrency}>£</Text>
          <TextInput
            style={styles.balanceAmountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Fingerprint button (no functionality yet) */}
      <TouchableOpacity
        style={styles.fingerprintButton}
        onPress={handleFingerprintPress}
        activeOpacity={0.9}
      >
        <Ionicons name="finger-print-outline" size={24} color="#f9fafb" />
        <Text style={styles.fingerprintText}>Take Payment</Text>
      </TouchableOpacity>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 72,
  },
  title: {
    fontSize: 50,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 25,
    fontWeight: "400",
    color: "#6b7280",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    alignSelf: "center",
  },
  balanceSection: {
    marginBottom: 16,
    alignItems: "center",
  },
  balanceLabel: {
    alignSelf: "center",
    fontSize: 30,
    color: "#5b21b6",
    fontWeight: "700",
    marginBottom: 4,
    marginTop: 10,
  },
  balanceAmountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCurrency: {
    fontSize: 32,
    fontWeight: "700",
    marginRight: 4,
  },
  balanceAmountInput: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    minWidth: 70,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  fingerprintButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 10,
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
