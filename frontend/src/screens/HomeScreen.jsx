import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const walletBalance = 1250.5;
  const [showBalance, setShowBalance] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const transactions = [
    {
      id: 1,
      merchantName: "Starbucks",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1577215451400-f207c63e30be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "10:30 AM",
      amount: -8.5,
    },
    {
      id: 2,
      merchantName: "Amazon",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "Yesterday, 3:45 PM",
      amount: -45.99,
    },
    {
      id: 3,
      merchantName: "Uber",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1615929361868-2e41ea1befaf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "Jun 9, 8:20 AM",
      amount: -15.0,
    },
    {
      id: 4,
      merchantName: "Starbucks",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1577215451400-f207c63e30be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "10:30 AM",
      amount: -8.5,
    },
    {
      id: 5,
      merchantName: "Amazon",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "Yesterday, 3:45 PM",
      amount: -45.99,
    },
    {
      id: 6,
      merchantName: "Uber",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1615929361868-2e41ea1befaf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "Jun 9, 8:20 AM",
      amount: -15.0,
    },
    {
      id: 7,
      merchantName: "Starbucks",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1577215451400-f207c63e30be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "10:30 AM",
      amount: -8.5,
    },
    {
      id: 8,
      merchantName: "Amazon",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "Yesterday, 3:45 PM",
      amount: -45.99,
    },
    {
      id: 9,
      merchantName: "Uber",
      merchantLogo: {
        uri: "https://images.unsplash.com/photo-1615929361868-2e41ea1befaf?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      time: "Jun 9, 8:20 AM",
      amount: -15.0,
    },
  ];

  const visibleTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>FingerPay</Text>
        <TouchableOpacity style={styles.verifyButton} onPress={() => {}}>
          <Text style={styles.verifyButtonText}>Verify Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.walletCard}>
        <View style={styles.walletHeaderRow}>
          <Text style={styles.walletTitle}>Wallet Balance</Text>

          <TouchableOpacity
            onPress={() => setShowBalance((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showBalance ? "eye-off" : "eye"}
              size={20}
              color="#5b21b6"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.walletAmount}>
          {showBalance ? `£${walletBalance.toFixed(2)}` : "****"}
        </Text>
      </View>

      <View style={styles.transactionHistoryContainer}>
        <View style={styles.transactionHeaderRow}>
          <Text style={styles.transactionHistoryTitle}>
            Transaction History
          </Text>

          <TouchableOpacity
            onPress={() => setShowAllTransactions((prev) => !prev)}
          >
            <Text style={styles.seeAllText}>
              {showAllTransactions ? "See less" : "See all"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={visibleTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Image source={item.merchantLogo} style={styles.merchantLogo} />
              <View style={styles.transactionDetails}>
                <Text style={styles.merchantName}>{item.merchantName}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.amount}>
                -£{Math.abs(item.amount).toFixed(2)}
              </Text>
            </View>
          )}
          // optional: limit height so it scrolls inside the card when expanded
          style={{ maxHeight: showAllTransactions ? 500 : undefined }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 27,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#5b21b6",
  },
  appName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  verifyButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  verifyButtonText: {
    color: "#5b21b6",
    fontWeight: "600",
  },
  walletHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    width: "100%",
  },
  eyeButton: {
    padding: 4,
  },
  walletCard: {
    backgroundColor: "#f0f8ff",
    padding: 20,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  walletTitle: {
    color: "#666",
    fontSize: 16,
  },
  walletAmount: {
    color: "#5b21b6",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  transactionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: "#5b21b6",
    fontWeight: "600",
  },
  transactionHistoryContainer: {
    marginTop: 24,
    backgroundColor: "#f7f7f7",
    margin: 10,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
  },
  transactionHistoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  merchantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    color: "#666",
    fontSize: 14,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5b21b6",
  },
});

export default HomeScreen;
