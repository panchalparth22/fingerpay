import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone_number || "null");
  const [email, setEmail] = useState(user?.email);
  const [address, setAddress] = useState(user?.address || "null");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          logout();                          // clear auth state
          navigation.reset({                 // go back to Login and clear history
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            // Implement delete account logic here
            console.log("Account deleted");
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={40} color="#5b21b6" />
        <Text style={styles.profileName}>{name}</Text>
      </View>

      {/* Personal Information Section */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{address}</Text>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.biometricRow}>
            <Text style={styles.biometricLabel}>Biometric Authentication</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={biometricEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
            />
          </View>

          <View style={styles.actionButton}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>        

        {/* Account Actions */}

        <View style={styles.actionButton}>
          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
            <Text style={styles.buttonTextLogout}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButton}>
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.buttonTextDelete}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5b21b6",
    marginBottom: 15,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  paymentLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },

  paymentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },

  paymentSubValue: {
    fontSize: 12,
    color: "#777",
  },

  paymentTag: {
    fontSize: 12,
    color: "#1e90ff",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  biometricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  biometricLabel: {
    fontSize: 16,
    color: "#333",
  },
  actionButton: {
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#5b21b6",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonLogout: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  buttonTextLogout: {
    color: "#856404",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonDelete: {
    backgroundColor: "#f8d7da",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5c6cb",
  },
  buttonTextDelete: {
    color: "#721c24",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ProfileScreen;
