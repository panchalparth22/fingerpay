import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isNotEmpty } from '../utils/validation';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config/env';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleSignUp = async () => {
  // Validate inputs
  if (!isNotEmpty(name)) {
    Alert.alert('Error', 'Please enter your full name');
    return;
  }
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
  if (password.length < 6) {
    Alert.alert('Error', 'Password must be at least 6 characters');
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }
  if (!isNotEmpty(phone)) {
    Alert.alert('Error', 'Please enter your phone number');
    return;
  }

  setLoading(true);
  try {
    // Call backend to register user
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone_number: phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }

    const createdUser = await response.json();

    // Log the user in using AuthContext
    login({
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      phone_number: createdUser.phone_number,
      balance: createdUser.balance,
    });

    // Navigate to main app
    navigation.replace('PaymentScreen');
  } catch (error) {
    Alert.alert('Registration failed', error.message || 'Unknown error');
  } finally {
    setLoading(false);
  }
};

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Customer Registration</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
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
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
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
          <Text style={styles.loadingText}>Creating account...</Text>
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
  heading: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    color: '#5b21b6', // gray-800
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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
  loadingContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 12,
    color: '#6b7280', // gray-600
  },
});

export default SignUpScreen;
