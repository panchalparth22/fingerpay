import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const MoneyScreen = () => {
  const handleBankTransfer = () => {
    Alert.alert(
      "Bank Transfer",
      "Bank transfer functionality will be implemented soon.",
      [{ text: "OK", style: "cancel" }],
    );
  };

  const handleCardPayment = () => {
    Alert.alert(
      "Card Payment",
      "Card payment functionality will be implemented soon.",
      [{ text: "OK", style: "cancel" }],
    );
  };

  const handleComingSoon = () => {
    Alert.alert("Coming Soon", "This feature is coming soon!", [
      { text: "OK", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Money to Wallet</Text>
      </View>

      <View style={styles.availableMethodsSection}>
        <Text style={styles.sectionTitle}>Available Payment Methods</Text>

        <TouchableOpacity
          style={styles.paymentMethodButton}
          onPress={handleBankTransfer}
        >
          <View style={[styles.paymentMethodContent, { justifyContent: "space-between" }]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <MaterialCommunityIcons name="bank-outline" style={styles.paymentMethodIcon} />
              <View>
                <Text style={styles.paymentMethodTitle}>Bank Transfer</Text>
                <Text style={styles.paymentMethodDescr}>
                  Transfer funds from bank account
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="greater-than" style={styles.go} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentMethodButton}
          onPress={handleCardPayment}
        >
          <View style={[styles.paymentMethodContent, { justifyContent: "space-between" }]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Ionicons name="card-outline" style={styles.paymentMethodIcon} />
              <View>
                <Text style={styles.paymentMethodTitle}>By Card</Text>
                <Text style={styles.paymentMethodDescr}>
                  Add funds using debit/credit card
                </Text>
              </View>
            </View>

            <MaterialCommunityIcons name="greater-than" style={styles.go} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.comingSoonSection}>
        <Text style={styles.sectionTitle}>Coming Soon</Text>

        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            styles.paymentMethodButtonDisabled,
          ]}
          onPress={handleComingSoon}
        >
          <View style={styles.paymentMethodContent}>
            <FontAwesome5
              name="apple-pay"
              size={24}
              style={styles.paymentMethodIcon}
            />
            <View>
              <Text style={styles.paymentMethodTitle}>Apple Pay</Text>
              <Text style={styles.paymentMethodDescrcomingSoon}>
                Secure payments with Face ID or Touch ID
              </Text>
            </View>
            <Text style={styles.comingSoonBadge}>Coming Soon</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodButton,
            styles.paymentMethodButtonDisabled,
          ]}
          onPress={handleComingSoon}
        >
          <View style={styles.paymentMethodContent}>
            <FontAwesome5
              name="paypal"
              size={24}
              style={styles.paymentMethodIcon}
            />
            <View>
              <Text style={styles.paymentMethodTitle}>PayPal</Text>
              <Text style={styles.paymentMethodDescrcomingSoon}>
                Pay using your PayPal balance
              </Text>
            </View>
            <Text style={styles.comingSoonBadge}>Coming Soon</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a01",
  },
  header: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  availableMethodsSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  comingSoonSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5b21b6",
    marginBottom: 12,
  },
  paymentMethodButton: {
    flexDirection: "row",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
  },
  paymentMethodButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#e9ecef",
  },
  paymentMethodContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  go: {
    fontSize: 26,
    color: "#5b21b6",
    marginLeft: 22,
    fontWeight: "600",
    alignSelf: "center",
  },
  paymentMethodIcon: {
    fontSize: 28,
    color: "#5b21b6",
    marginRight: 16,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  paymentMethodDescr: {
    fontSize: 14,
    color: "#666",
  },
  paymentMethodDescrComingSoon: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  comingSoonBadge: {
    position: "absolute",
    right: 5,
    top: -5,
    backgroundColor: "#ffc107",
    color: "#212529",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

export default MoneyScreen;
