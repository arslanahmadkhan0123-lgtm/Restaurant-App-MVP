import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartScreen() {
  const { state, dispatch } = useCart();
  const [promoInput, setPromoInput] = useState("");

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (subtotal * state.discountPercent) / 100;
  const grandTotal = subtotal - discount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shopping Cart</Text>
      <FlatList
        data={state.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>${(item.price * item.quantity).toFixed(2)}</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Special instructions (e.g. no onions)"
                value={item.notes}
                onChangeText={(val) => dispatch({ type: "UPDATE_NOTE", payload: { id: item.id, notes: val } })}
              />
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => dispatch({ type: "DECREMENT", payload: item.id })}>
                <Text style={styles.stepBtn}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 8 }}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => dispatch({ type: "INCREMENT", payload: item.id })}>
                <Text style={styles.stepBtn}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}>
              <Text style={{ color: "red", marginLeft: 10 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Promo Section */}
      <View style={styles.promoRow}>
        <TextInput
          style={styles.promoInput}
          placeholder="Promo code (e.g. WELCOME10)"
          value={promoInput}
          onChangeText={setPromoInput}
        />
        <TouchableOpacity style={styles.promoBtn} onPress={() => dispatch({ type: "APPLY_PROMO", payload: promoInput })}>
          <Text style={{ color: "#fff" }}>Apply</Text>
        </TouchableOpacity>
      </View>
      {state.error && <Text style={{ color: "red", fontSize: 12 }}>{state.error}</Text>}
      {state.discountPercent > 0 && (
        <Text style={{ color: "green", fontSize: 12 }}>Promo applied: {state.discountPercent}% off</Text>
      )}

      {/* Totals */}
      <View style={styles.totalContainer}>
        <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text>Discount: -${discount.toFixed(2)}</Text>
        <Text style={styles.grandTotal}>Grand Total: ${grandTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: { flexDirection: "row", padding: 10, backgroundColor: "#f8f9fa", borderRadius: 8, marginBottom: 10, alignItems: "center" },
  name: { fontWeight: "bold", fontSize: 16 },
  price: { color: "#FF6347", fontWeight: "bold" },
  noteInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 4, padding: 4, fontSize: 12, marginTop: 5 },
  stepper: { flexDirection: "row", alignItems: "center", backgroundColor: "#e2e2e2", paddingHorizontal: 8, borderRadius: 4 },
  stepBtn: { fontSize: 16, fontWeight: "bold", paddingHorizontal: 6 },
  promoRow: { flexDirection: "row", marginTop: 10 },
  promoInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 8, marginRight: 10 },
  promoBtn: { backgroundColor: "#007BFF", justifyContent: "center", paddingHorizontal: 15, borderRadius: 6 },
  totalContainer: { marginTop: 15, padding: 10, backgroundColor: "#f1f3f5", borderRadius: 8 },
  grandTotal: { fontSize: 18, fontWeight: "bold", marginTop: 5, color: "#FF6347" },
});