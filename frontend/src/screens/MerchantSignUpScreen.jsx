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
import { isNotEmpty } from "../utils/validation";
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
    // Validate required fields only
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
      // Construct merchant object with only required fields (and balance default)
      const merchantData = {
        company_name: companyName,
        merchant_name: merchantName,
        phone_number: phoneNumber,
        VAT_number: VATNumber,
        license_number: licenseNumber,
        balance: 0, // default as per schema
        // Optional fields (address, bank_details) omitted as per requirement
      };

      // In a real app, we would call the backend to register merchant
      // For now, we stub it by creating a merchant object and logging in
      const fakeUser = {
        id: Math.floor(Math.random() * 10000),
        company_name: companyName,
        merchant_name: merchantName,
        email: `${merchantName.toLowerCase().replace(/\s/g, "")}@example.com`, // placeholder email for auth
      };
      login(fakeUser);

      // Navigate to main app (or merchant dashboard)
      navigation.replace("PaymentScreen");
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
