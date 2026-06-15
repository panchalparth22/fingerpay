import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/env';
import { isValidEmail, isNotEmpty } from '../utils/validation';
import { useNavigation } from '@react-navigation/native';

const MerchantLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!isNotEmpty(email)) {
      Alert.alert('Error', 'Please enter an email');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    if (!isNotEmpty(password)) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/merchant/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Log the merchant in using AuthContext
      login({
        user: {
          id: data.id,
          email: data.email,
          name: data.merchant_name,
          company_name: data.company_name,
          merchant_name: data.merchant_name,
          phone_number: data.phone_number,
          VAT_number: data.VAT_number,
          license_number: data.license_number,
          balance: data.balance,
        },
        token: data.token,
        role: 'merchant', // Add role to distinguish between merchant and customer
      });

      // Navigate to main app (or merchant dashboard)
      navigation.replace("PaymentScreen");
    } catch (error) {
      Alert.alert('Login failed', error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality coming soon.');
  };

  const handleSignUp = () => {
    // Alert.alert('Sign Up', 'Sign up functionality coming soon.');
    navigation.navigate('MerchantSignUpScreen'); // Uncomment when MerchantSignUpScreen is created
  };

  const handleCustomerLink = () => {
    navigation.navigate('LoginScreen'); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <Image
            source={require('../../assets/logo.png')} 
            style={styles.logo}
          />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>      
          <Text style={[styles.heading, { color: '#5b21b6' }]}>Finger</Text><Text style={styles.heading}>Pay</Text>
        </View>
      <Text style={styles.slogan}>Your fingerprint, your wallet!</Text>
      <Text style={styles.merchantHeading}>Merchant Login</Text>

      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Login</Text>
        <TextInput
          placeholder="Enter your merchant email"
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
        
        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
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
        
        <TouchableOpacity style={styles.merchantLink} onPress={handleCustomerLink}>
          <Text style={styles.merchantLinkText}>Are you a Customer?</Text>
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
    backgroundColor: '#f9fafb', // gray-50
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 82,
    height: 82,
    marginBottom: 12,
  },
  heading: {
    fontSize: 48,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937', // gray-800
  },
  merchantHeading: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#5b21b6', // blue-600
    textDecorationLine: 'underline',
  },
  slogan: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6b7280', // gray-600
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151', // gray-700
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  forgotPassword: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  forgotPasswordText: {
    color: '#5b21b6', // blue-600
    fontSize: 14,
    fontWeight: '500',
    marginTop: -8,
    marginBottom: -5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#6b7280', // gray-600
  },
  signUpLink: {
    marginLeft: 4,
  },
  signUpLinkText: {
    fontSize: 14,
    color: '#5b21b6', // blue-600
    fontWeight: '500',
  },
  merchantLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  merchantLinkText: {
    fontSize: 14,
    color: '#5b21b6', // blue-600
    fontWeight: '500',
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 12,
    color: '#6b7280', // gray-600
  },
});

export default MerchantLoginScreen;
