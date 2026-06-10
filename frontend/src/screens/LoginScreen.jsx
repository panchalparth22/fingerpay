import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, isNotEmpty } from "../utils/validation";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../config/env";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!isNotEmpty(email)) {
      Alert.alert("Error", "Please enter an email");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    if (!isNotEmpty(password)) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || "Invalid email or password";
        Alert.alert("Login failed", message);
        return;
      }

      const data = await response.json();

      // data should include user info (and maybe a token) from your backend
      // e.g. { id, name, email, ... }
      login(data.user || data);
    } catch (error) {
      Alert.alert("Login failed", error.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality coming soon.");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  const handleMerchantLink = () => {
    navigation.navigate("MerchantLoginScreen");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.heading}>FingerPay</Text>
          <Text style={styles.slogan}>Your fingerprint, your wallet!</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Login</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            color="#5b21b6"
            disabled={loading}
          />

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an Account? </Text>
            <TouchableOpacity style={styles.signUpLink} onPress={handleSignUp}>
              <Text style={styles.signUpLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.merchantLink}
            onPress={handleMerchantLink}
          >
            <Text style={styles.merchantLinkText}>Are you a Merchant?</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Logging in...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 82,
    height: 82,
    marginBottom: 12,
  },
  heading: {
    fontSize: 48,
    fontWeight: "800",
    textAlign: "center",
    color: "#1f2937", // gray-800
  },
  slogan: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 32,
    color: "#6b7280", // gray-600
    letterSpacing: 0.5,
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#374151", // gray-700
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  forgotPassword: {
    marginBottom: 24,
    alignItems: "flex-start",
  },
  forgotPasswordText: {
    color: "#5b21b6", // blue-600
    fontSize: 14,
    fontWeight: "500",
    marginTop: -8,
    marginBottom: -5,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: "#6b7280", // gray-600
  },
  signUpLink: {
    marginLeft: 4,
  },
  signUpLinkText: {
    fontSize: 14,
    color: "#5b21b6", // blue-600
    fontWeight: "500",
  },
  merchantLink: {
    marginTop: 20,
    alignItems: "center",
  },
  merchantLinkText: {
    fontSize: 14,
    color: "#5b21b6", // blue-600
    fontWeight: "500",
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 12,
    color: "#6b7280", // gray-600
  },
});

export default LoginScreen;
