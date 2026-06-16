// screens/VerifyFingerprintScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { API_BASE_URL } from "../config/env";

const VerifyFingerprintScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(null); // new

  const handleConfirm = async () => {
    setError(null);
    setFoundUser(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // basic validation
    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password.");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/user/verify-credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // add Authorization if your API requires merchant auth here
          // Authorization: `Bearer ${merchantToken}`,
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      if (!data.user) {
        throw new Error("User not found");
      }

      setFoundUser(data.user);

      // Later: trigger fingerprint using data.user
      // await triggerFingerprintForUser(data.user);
    } catch (e) {
      setError(e.message || "Failed to verify user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPress = async () => {
    setError(null);

    try {
      setLoading(true);
      // TODO: here you'll call your Python/fingerprint integration later.
      // For now, you can just log or show a toast.
      
    } catch (e) {
      setError("Fingerprint verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify with FingerPay</Text>
        <Text style={styles.subtitle}>
          Enter the customer's email registered with FingerPay, then verify via
          fingerprint.
        </Text>

        <Text style={styles.label}>Customer email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="customer@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={[styles.label, { marginTop: 12 }]}>Customer password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[
            styles.button,
            loading && { opacity: 0.7 },
            { backgroundColor: "#008000" },
          ]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Finding..." : "Find User"}
          </Text>
        </TouchableOpacity>

        {foundUser && (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {foundUser.name ? foundUser.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>Matched FingerPay user</Text>
              <Text style={styles.userName}>{foundUser.name}</Text>
              <Text style={styles.userEmail}>{foundUser.email}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleVerifyPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify fingerprint"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VerifyFingerprintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#5b21b6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f4f4ff",
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5b21b6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  userEmail: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 2,
  },
});
