import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/env";
import { useNavigation } from "@react-navigation/native";
import AmountInput from "../components/AmountInput";
import PrimaryButton from "../components/PrimaryButton";
import { formatCurrency } from "../utils/formatCurrency";
import { isNotEmpty, isPositiveNumber } from "../utils/validation";

const PaymentScreen = () => {
  const { user, token, login, logout } = useAuth();
  const navigation = useNavigation();

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Optionally refresh user data on mount to ensure latest balance
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);


  const handleLogout = async () => {
    await logout(); // clears AsyncStorage + context
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }], // root stack screen for login/register
    });
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.user) {
        login({ user: data.user, token });
      }
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
  };

  const handleSendPayment = async () => {
    if (!isNotEmpty(recipient)) {
      setError("Please enter recipient (email or phone number)");
      return;
    }
    const amountNum = parseFloat(amount);
    if (!isPositiveNumber(amountNum)) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientIdentifier: recipient,
          amount: amountNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment failed");
      }

      // Update auth context with updated user data (balance changed)
      login({ user: data.user, token });

      // Navigate to result screen (we can reuse PaymentResultScreen)
      navigation.navigate("PaymentResultScreen", {
        user: data.user,
        transaction: data.transaction,
      });
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pay Money</Text>
      </View>

      {/* Recipient */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Recipient (email or phone)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email or phone number"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Amount */}
      <View style={styles.inputSection}>
        <AmountInput
          label="Amount (£)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
        />
      </View>

      {/* Fee and total (placeholder) */}
      <View style={styles.totalsSection}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Fee</Text>
          <Text style={styles.totalsValue}>£0.00</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Total</Text>
          <Text style={styles.totalsValue}>
            {amount ? `£${parseFloat(amount).toFixed(2)}` : "£0.00"}
          </Text>
        </View>
      </View>

      {/* Send button */}
      <PrimaryButton
        style={{ marginTop: 20, backgroundColor: "#5b21b6" }}
        title="Send Payment"
        onPress={handleSendPayment}
        loading={loading}
      />

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <Button title="Log out" onPress={handleLogout} />
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
    marginVertical: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  paymentMethodSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  paymentMethodInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: "#374151",
  },
  paymentMethodValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  addPaymentMethodButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#5b21b6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addPaymentMethodText: {
    color: "#5b21b6",
    fontSize: 14,
    fontWeight: "600",
  },
  totalsSection: {
    marginBottom: 24,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  totalsLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  labelTotal: {
    fontWeight: "600",
  },
  totalsValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  valueTotal: {
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
