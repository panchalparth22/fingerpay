// navigation/AppNavigator.jsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import BottomNavBar from "../components/BottomNavBar";

import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import PaymentScreen from "../screens/PaymentScreen";
import EnrolmentScreen from "../screens/EnrolmentScreen";
import PaymentResultScreen from "../screens/PaymentResultScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import MerchantLoginScreen from "../screens/MerchantLoginScreen";
import MerchantSignUpScreen from "../screens/MerchantSignUpScreen";
import VerifyAccountScreen from "../screens/VerifyAccountScreen";

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

// Auth stack (shown when NOT authenticated)
const AuthStackScreen = () => (
  <AuthStack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{ headerShown: false }}
  >
    <AuthStack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="SignUpScreen"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="MerchantLoginScreen"
      component={MerchantLoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="MerchantSignUpScreen"
      component={MerchantSignUpScreen}
      options={{ headerShown: false }}
    />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen
            name="SplashScreen"
            component={SplashScreen}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main branch that changes based on auth */}
        {!isAuthenticated ? (
          <RootStack.Screen
            name="Auth"
            component={AuthStackScreen}
          />
        ) : (
          <RootStack.Screen
            name="Main"
            component={BottomNavBar}
          />
        )}

        {/* Shared screens that either branch can navigate to */}
        <RootStack.Screen
          name="VerifyAccountScreen"
          component={VerifyAccountScreen}
        />

        {/* Optional: if any of these are not inside BottomNavBar navigators,
            you can also register them here in RootStack */}
        <RootStack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />
        <RootStack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
        />
        <RootStack.Screen
          name="EnrolmentScreen"
          component={EnrolmentScreen}
        />
        <RootStack.Screen
          name="PaymentResultScreen"
          component={PaymentResultScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;