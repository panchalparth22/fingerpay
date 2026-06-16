import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/env";

const MerchantHistoryScreen = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchMerchantTransactions = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/merchant/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load transactions");
      }

      // expect data.transactions = [ { customerName, amount, createdAt, ... }, ... ]
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      fetchMerchantTransactions();
    }, [token]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMerchantTransactions();
  };

  const renderItem = ({ item }) => {
    const d = new Date(item.createdAt);

    const date = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const time = d
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();

    return (
      <View style={styles.item}>
        <View style={styles.left}>
          <Text style={styles.username}>
            {item.customerName || item.customerEmail}
          </Text>
          <Text style={styles.time}>
            {date} • {time}
          </Text>
        </View>
        <Text style={styles.amount}>
          +£{Number(item.amount || 0).toFixed(2)}
        </Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.title}>Recent Transactions</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            !error && <Text style={styles.empty}>No transactions yet.</Text>
          }
        />
      </ScrollView>
    </View>
  );
};

export default MerchantHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#efefef",
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
    marginTop: 18,
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: "#00000011",
  },
  left: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#008000",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 16,
    color: "#777",
  },
});
