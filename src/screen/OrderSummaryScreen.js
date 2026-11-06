import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useCart } from "../context/CartContext";

const SERVICE_CHARGE_RATE = 0.05;
const SALES_TAX_RATE = 0.15;

export default function OrderSummaryScreen() {
  const { state } = useCart();

  const { subtotal, serviceCharge, salesTax, discount, grandTotal } = useMemo(() => {
    const sub = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const sCharge = sub * SERVICE_CHARGE_RATE;
    const tax = sub * SALES_TAX_RATE;
    const disc = (sub * state.discountPercent) / 100;
    const total = sub + sCharge + tax - disc;
    return { subtotal: sub, serviceCharge: sCharge, salesTax: tax, discount: disc, grandTotal: total };
  }, [state.items, state.discountPercent]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <View style={styles.box}>
        <Text style={styles.row}>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text style={styles.row}>Service Charge (5%): ${serviceCharge.toFixed(2)}</Text>
        <Text style={styles.row}>Sales Tax (15%): ${salesTax.toFixed(2)}</Text>
        {discount > 0 && <Text style={[styles.row, { color: "green" }]}>Discount: -${discount.toFixed(2)}</Text>}
        <View style={styles.divider} />
        <Text style={styles.total}>Grand Total: ${grandTotal.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => Alert.alert("Order", "Proceeding to checkout...")}>
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Confirm & Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  box: { backgroundColor: "#f8f9fa", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#e2e2e2" },
  row: { fontSize: 16, marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 10 },
  total: { fontSize: 18, fontWeight: "bold", color: "#FF6347" },
  btn: { backgroundColor: "#FF6347", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
});