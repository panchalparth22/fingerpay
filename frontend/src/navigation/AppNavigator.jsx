import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Hide splash after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator initialRouteName="PaymentScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="PaymentScreen" 
            component={PaymentScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EnrolmentScreen" 
            component={EnrolmentScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="PaymentResultScreen" 
            component={PaymentResultScreen} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="SignUpScreen" 
            component={SignUpScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="MerchantLoginScreen" 
            component={MerchantLoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="MerchantSignUpScreen" 
            component={MerchantSignUpScreen} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

// Import screens at the bottom to avoid circular dependencies
import SplashScreen from '../screens/SplashScreen';
import PaymentScreen from '../screens/PaymentScreen';
import EnrolmentScreen from '../screens/EnrolmentScreen';
import PaymentResultScreen from '../screens/PaymentResultScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MerchantLoginScreen from '../screens/MerchantLoginScreen';
import MerchantSignUpScreen from '../screens/MerchantSignUpScreen';

export default AppNavigator;
