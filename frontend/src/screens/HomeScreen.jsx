import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext"; // adjust path
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../config/env";

const HomeScreen = () => {
  const { user, token } = useAuth();
  const navigation = useNavigation();
  const userName = user?.name || "there";
  const walletBalance = user?.balance;
  const [balance, setBalance] = useState();
  const [showBalance, setShowBalance] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const fetchHomeData = async (token) => {
    const [userRes, txRes] = await Promise.all([
      fetch(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/user/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const userData = await userRes.json();
    const txData = await txRes.json();
    // console.log("trasn::", txData);
    console.log(userData);

    if (!userRes.ok) throw new Error(userData.error || "Failed to load user");
    if (!txRes.ok)
      throw new Error(txData.error || "Failed to load transactions");

    return { user: userData, transactions: txData.transactions };
  };

  const loadData = async () => {
    try {
      setError(null);
      const data = await fetchHomeData(token);
      setBalance(Number(data.user.user.balance) || 0);
      setTransactions(data.transactions);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 1) Load when screen first mounts and whenever it gets focus again
  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      loadData();
    }, [token]),
  );

  // 2) Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.subGreetingText}>Hi, {userName} 👋</Text>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => {
            navigation.navigate("VerifyAccountScreen");
          }}
        >
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
          {showBalance ? `£${Number(balance || 0).toFixed(2)}` : "****"}
        </Text>
      </View>

      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.transactionHistoryContainer}>
          <View style={styles.transactionHeaderRow}>
            <Text style={styles.transactionHistoryTitle}>
              Recent Transactions
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
            style={{ marginTop: 16 }}
            data={transactions} // already mapped to UI shape
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const d = new Date(item.createdAt);

              const date = d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              const time = d.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <View style={styles.transactionItem}>
                  {item.merchantImage ? (
                    <Image
                      source={{ uri: item.merchantImage }}
                      style={styles.merchantLogo}
                    />
                  ) : (
                    <View
                      style={[styles.merchantLogo, { backgroundColor: "#eee" }]}
                    />
                  )}
                  <View style={styles.transactionDetails}>
                    <Text style={styles.merchantName}>{item.merchantName}</Text>
                    <Text style={styles.time}>{date}</Text>
                    <Text style={{ fontSize: 12, color: "#1a1a1a70" }}>
                      {time}
                    </Text>
                  </View>
                  <Text style={styles.amount}>
                    {item.amount < 0 ? "-" : "-£"}
                    {Math.abs(item.amount).toFixed(2)}
                  </Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a01",
    paddingTop: 27,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#5b21b6",
  },
  greetingText: {
    color: "#e5e7eb",
    fontSize: 13,
  },
  subGreetingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 2,
    fontWeight: "600",
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
    backgroundColor: "#fff",
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
    margin: 10,
    paddingTop: 16,
    paddingBottom: 16,
  },
  transactionHistoryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 16,
    backgroundColor: "#fff",
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
