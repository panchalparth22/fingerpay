// screens/WithdrawScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext"; // where merchant and token come from
import { API_BASE_URL } from "../config/env";

const MerchantWithdrawScreen = () => {
  const { user, token } = useAuth(); // adjust names to your context
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(Number(user?.balance || 0));

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // console.log(user);

  // const walletBalance = Number(user?.balance || 0);

  const fetchMerchantBalance = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/merchant/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load merchant");
      }

      const numericBalance = Number(data.balance || 0);
      setBalance(Number.isFinite(numericBalance) ? numericBalance : 0);

      // // optional: also update global merchant context
      // if (setMerchant) {
      //   setMerchant((prev) => ({ ...(prev || {}), ...data }));
      // }
    } catch (err) {
      setError(err.message || "Failed to load merchant");
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      fetchMerchantBalance();
    }, [token]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMerchantBalance();
  };

  // restrict to 2 decimals
  const handleAmountChange = (text) => {
    let cleaned = text.replace(/[^0-9.]/g, "");

    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts[1];
    }
    if (parts.length === 2) {
      const integerPart = parts[0];
      const decimalPart = parts[1].slice(0, 2);
      cleaned = integerPart + "." + decimalPart;
    }

    setAmount(cleaned);
  };

  const handleWithdraw = async () => {
    setError(null);

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (numericAmount > balance) {
      setError("Amount exceeds available wallet balance.");
      return;
    }

    try {
      setLoading(true);

      // Call your backend withdraw endpoint
      const res = await fetch(`${API_BASE_URL}/merchant/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Withdraw failed");
      }

      // Optionally update merchant balance in your auth context
      // e.g. setMerchant(data.merchant)

      // Clear amount and maybe show a success state
      setAmount("");
    } catch (err) {
      setError(err.message || "Withdraw failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Wallet balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Wallet balance</Text>
          <Text style={styles.balanceAmount}>£{balance.toFixed(2)}</Text>
        </View>
        {/* Amount input */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Amount to withdraw (£)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>£</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {/* Withdraw button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleWithdraw}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : "Withdraw to bank"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MerchantWithdrawScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  balanceCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f4f4ff",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currency: {
    fontSize: 22,
    fontWeight: "600",
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "left",
  },
  error: {
    color: "red",
    marginTop: 8,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#5b21b6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
