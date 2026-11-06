import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

function MenuItemCard({ item, onAddToCart, onToggleFavorite, isFavorite }) {
  console.log(`[Render] MenuItemCard: ${item.name}`);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => onToggleFavorite(item.id)} style={{ marginRight: 10 }}>
        <Text style={{ fontSize: 20 }}>{isFavorite ? "❤️" : "🤍"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addBtn} onPress={() => onAddToCart(item)}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(MenuItemCard);

const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, alignItems: "center", elevation: 2 },
  image: { width: 60, height: 60, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { color: "#FF6347", fontWeight: "bold" },
  addBtn: { width: 30, height: 30, backgroundColor: "#FF6347", borderRadius: 15, justifyContent: "center", alignItems: "center" },
});