import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { authenticateWithBiometrics } from '../services/biometricService';
import { getBiometricId, setBiometricId } from '../services/storageService';
import { payWithBiometric, createUser } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { isPositiveNumber } from '../utils/validation';
import AmountInput from '../components/AmountInput';
import PrimaryButton from '../components/PrimaryButton';

const PaymentScreen = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: merchant } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  const handlePayWithFingerprint = async () => {
    if (!isPositiveNumber(parseFloat(amount))) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    const amountNum = parseFloat(amount);
    setLoading(true);
    setError(null);

    try {
      // Authenticate with biometrics
      await authenticateWithBiometrics('Confirm payment with fingerprint');

      // Get or create biometric ID for this customer
      let biometricId = await getBiometricId();
      if (!biometricId) {
        // Generate a random biometric ID (in reality, this would come from the device's fingerprint sensor)
        biometricId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await setBiometricId(biometricId);
      }

      // Process the payment
      const result = await payWithBiometric({ biometricId, amount: amountNum });
      
      // Navigate to result screen
      navigation.navigate('PaymentResultScreen', { 
        user: result.user, 
        transaction: result.transaction 
      });
    } catch (err) {
      if (err.code === 'UNKNOWN_BIOMETRIC') {
        // Navigate to enrolment screen with the biometric ID and amount
        const biometricId = await getBiometricId() || 'unknown';
        navigation.navigate('EnrolmentScreen', { 
          biometricId, 
          amount: amountNum 
        });
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds for this transaction');
      } else {
        setError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FingerPay Payment</Text>
      {merchant && (
        <Text style={styles.subtitle}>Logged in as: {merchant.email}</Text>
      )}
      
      <View style={styles.form}>
        <AmountInput 
          label="Amount (£)"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
        />
        
        {error && (
          <View style={styles.error}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <PrimaryButton 
          title="Pay with Fingerprint"
          onPress={handlePayWithFingerprint}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9fafb', // gray-50
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937', // gray-800
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    color: '#6b7280', // gray-600
  },
  form: {
    // space-y-4 equivalent: we'll add marginBottom to each child except last
  },
  error: {
    padding: 16,
    backgroundColor: '#fef2f2', // red-50
    borderLeftWidth: 4,
    borderColor: '#dc2626', // red-600
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c', // red-700
    fontWeight: '500',
  },
});

export default PaymentScreen;
