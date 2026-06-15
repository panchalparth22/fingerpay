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
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/env";
import { isNotEmpty, isValidEmail } from "../utils/validation";
import { useNavigation } from "@react-navigation/native";

const MerchantSignUpScreen = () => {
  const [companyName, setCompanyName] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [VATNumber, setVATNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleSignUp = async () => {
    // Validate required fields
    if (!isNotEmpty(companyName)) {
      Alert.alert("Error", "Please enter company name");
      return;
    }
    if (!isNotEmpty(merchantName)) {
      Alert.alert("Error", "Please enter merchant name");
      return;
    }
    if (!isNotEmpty(email)) {
      Alert.alert("Error", "Please enter an email");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    if (!isNotEmpty(phoneNumber)) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }
    if (!isNotEmpty(VATNumber)) {
      Alert.alert("Error", "Please enter VAT number");
      return;
    }
    if (!isNotEmpty(licenseNumber)) {
      Alert.alert("Error", "Please enter license number");
      return;
    }
    if (!isNotEmpty(password)) {
      Alert.alert("Error", "Please enter a password");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/merchant/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: companyName,
          merchant_name: merchantName,
          email: email,
          password: password,
          phone_number: phoneNumber,
          VAT_number: VATNumber,
          license_number: licenseNumber,
          address: "", // optional
          bank_details: {}, // optional
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();

      // Log the merchant in using AuthContext (reuse login)
      login({
        user: {
          id: data.id,
          email: data.email,
          name: data.merchant_name, // using merchant_name as name
          // we can also pass additional fields if needed by auth context
          company_name: data.company_name,
          merchant_name: data.merchant_name,
          phone_number: data.phone_number,
          VAT_number: data.VAT_number,
          license_number: data.license_number,
          balance: data.balance,
        },
        token: data.token,
        role: "merchant", // Add role to distinguish between merchant and customer
      });

      // Navigate to main app (or merchant dashboard)
      navigation.replace("PaymentScreen"); // Assuming this is the main screen after login
    } catch (error) {
      Alert.alert("Registration failed", error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("MerchantLoginScreen"); // Assuming this exists
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Merchant Registration</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              placeholder="Enter your company name"
              value={companyName}
              onChangeText={setCompanyName}
              autoCapitalize="words"
              style={styles.input}
            />

            <Text style={styles.label}>Merchant Name (Display Name)</Text>
            <TextInput
              placeholder="Enter your merchant display name"
              value={merchantName}
              onChangeText={setMerchantName}
              autoCapitalize="words"
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              style={styles.input}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Text style={styles.label}>VAT Number</Text>
            <TextInput
              placeholder="Enter VAT number"
              value={VATNumber}
              onChangeText={setVATNumber}
              autoCapitalize="characters"
              style={styles.input}
            />

            <Text style={styles.label}>License Number</Text>
            <TextInput
              placeholder="Enter license number"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              autoCapitalize="characters"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />

            <Button
              title="Sign Up"
              onPress={handleSignUp}
              color="#5b21b6"
              disabled={loading}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity style={styles.signUpLink} onPress={handleLogin}>
                <Text style={styles.signUpLinkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Creating merchant account...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
  },
  scrollContent: {
    flexGrow: 1,
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
  heading: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    color: "#5b21b6", // gray-800
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
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
  loadingContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 12,
    color: "#6b7280", // gray-600
  },
});

export default MerchantSignUpScreen;
