import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';

export default function OrderTrackingScreen() {
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestOrder = async () => {
    try {
      const orders = await apiClient('/orders/my');
      if (orders && orders.length > 0) {
        setActiveOrder(orders[0]); // Get most recent order
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLatestOrder();

    // Poll every 10 seconds for real-time status updates
    const intervalId = setInterval(() => {
      fetchLatestOrder();
    }, 10000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order Status</Text>
      {activeOrder ? (
        <View style={{ marginTop: 10 }}>
          <Text>Order ID: {activeOrder._id}</Text>
          <Text style={{ fontSize: 18, color: 'green', marginTop: 5 }}>
            Status: {activeOrder.status}
          </Text>
          <Text>Total: PKR {activeOrder.total}</Text>
        </View>
      ) : (
        <Text>No active orders found.</Text>
      )}
    </View>
  );
};