import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  PrimaryButton,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { LayoutAnimation } from "react-native";

const MoneyScreen = () => {
  const { user } = useAuth();
  useEffect(() => {
    console.log(user);
  }, []);

  const navigation = useNavigation();

  const [bankExpanded, setBankExpanded] = useState(false);
  const [bankTopupAmount, setBankTopupAmount] = useState("");
  const [bankTopupError, setBankTopupError] = useState(null);

  const [cardExpanded, setCardExpanded] = useState(false);
  const [cardTopupAmount, setCardTopupAmount] = useState("");
  const [cardTopupError, setCardTopupError] = useState(null);

  const handleCardPayment = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setCardExpanded((prev) => !prev);
    setCardTopupError(null);
    if (!cardExpanded) {
      setBankExpanded(false);
    }
  };
  const handleCardTopup = () => {
    // later: call backend, update balance
    setCardTopupAmount("");
    setCardExpanded(false);
  };

  const handleBankTransfer = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // if you require a linked bank account first, you can check:
    // if (!user?.accountDetails) {
    //   navigation.navigate("BankDetailsScreen");
    //   return;
    // }

    setBankExpanded((prev) => !prev);
    setBankTopupError(null);

    // optional: collapse card section when bank expands
    if (!bankExpanded) {
      setCardExpanded(false);
    }
  };
  const handleBankTopup = () => {
    // Later: call your /wallet/topup-bank endpoint and update context
    setBankTopupAmount("");
    setBankExpanded(false);
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
          <View
            style={[
              styles.paymentMethodContent,
              { justifyContent: "space-between" },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <MaterialCommunityIcons
                name="bank-outline"
                style={styles.paymentMethodIcon}
              />
              <View>
                <Text style={styles.paymentMethodTitle}>Bank Transfer:</Text>
                {user?.accountDetails ? (
                  <Text>
                    {user.accountDetails.bankName} * * * *{" "}
                    {user.accountDetails.accountNumber.slice(-4)}
                  </Text>
                ) : (
                  <Text>You need to add Bank Details first</Text>
                )}
                <Text style={styles.paymentMethodDescr}>
                  Transfer funds from bank account
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="greater-than"
              style={[
                styles.go,
                {
                  transform: [
                    { rotate: bankExpanded ? "270deg" : "90deg" }, // flips on click
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {bankExpanded && (
          <View style={styles.bankExpandContainer}>
            <Text style={styles.expandLabel}>Add money from bank</Text>
            <TextInput
              style={styles.expandInput}
              placeholder="Amount (£)"
              keyboardType="numeric"
              value={bankTopupAmount}
              onChangeText={setBankTopupAmount}
            />
            {bankTopupError && (
              <Text style={styles.expandError}>{bankTopupError}</Text>
            )}

            <TouchableOpacity
              style={styles.bankAddButton}
              onPress={handleBankTopup}
              activeOpacity={0.9}
            >
              <Text style={styles.bankAddButtonText}>Add to wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.paymentMethodButton}
          onPress={handleCardPayment}
        >
          <View
            style={[
              styles.paymentMethodContent,
              { justifyContent: "space-between" },
            ]}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <Ionicons name="card-outline" style={styles.paymentMethodIcon} />
              <View>
                <Text style={styles.paymentMethodTitle}>By Card</Text>
                {user?.cardDetails ? (
                  <Text>
                    Primary Card * * * * {user.cardDetails.cardNumber.slice(-4)}
                  </Text>
                ) : (
                  <Text>You need to add Bank Details first</Text>
                )}
                <Text style={styles.paymentMethodDescr}>
                  Add funds using debit/credit card
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="greater-than"
              style={[
                styles.go,
                {
                  transform: [
                    { rotate: cardExpanded ? "270deg" : "90deg" }, // flips on click
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        {cardExpanded && (
          <View style={styles.cardExpandContainer}>
            <Text style={styles.expandLabel}>Add money with card</Text>
            <TextInput
              style={styles.expandInput}
              placeholder="Amount (£)"
              keyboardType="numeric"
              value={cardTopupAmount}
              onChangeText={setCardTopupAmount}
            />
            {cardTopupError && (
              <Text style={styles.expandError}>{cardTopupError}</Text>
            )}
            <TouchableOpacity
              style={styles.cardAddButton}
              onPress={handleCardTopup}
              activeOpacity={0.9}
            >
              <Text style={styles.cardAddButtonText}>Add to wallet</Text>
            </TouchableOpacity>
          </View>
        )}
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
    transform: [{ rotate: "90deg" }],
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
  bankExpandContainer: {
    marginTop: 8,
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  expandLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  expandInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  expandError: {
    marginTop: 4,
    color: "#b91c1c",
    fontSize: 12,
  },
  bankAddButton: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: "#5b21b6",
    paddingVertical: 12,
    alignItems: "center",
  },
  bankAddButtonText: {
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "600",
  },
  cardExpandContainer: {
    marginTop: 8,
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  expandLabel: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  expandInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  expandError: {
    marginTop: 4,
    color: "#b91c1c",
    fontSize: 12,
  },
  cardAddButton: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: "#5b21b6",
    paddingVertical: 12,
    alignItems: "center",
  },
  cardAddButtonText: {
    color: "#f9fafb",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default MoneyScreen;
