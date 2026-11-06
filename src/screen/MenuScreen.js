import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { categories, menuItemsData } from "../data/menu";
import { useCart } from "../context/CartContext";

export default function MenuScreen() {
  const { dispatch } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const searchInputRef = useRef(null);
  const flatListRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const prevQueryRef = useRef("");
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;

  // Manual Debounce using useRef
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(text);
      const trimmed = text.trim();
      if (trimmed && prevQueryRef.current !== trimmed) {
        setSearchHistory((prev) => [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, 5));
        prevQueryRef.current = trimmed;
      }
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const filteredItems = menuItemsData.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable !== false;
  });

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 300 && !showScrollTop) setShowScrollTop(true);
    else if (offsetY <= 300 && showScrollTop) setShowScrollTop(false);
  };

  return (
    <View style={styles.container}>
      {/* Debug Render Counter */}
      <View style={styles.debugBadge}>
        <Text style={styles.debugText}>Renders: {renderCountRef.current}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search menu items..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchQuery(""); setDebouncedQuery(""); }}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Search Suggestions */}
      {isFocused && searchQuery === "" && searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Searches:</Text>
          {searchHistory.map((term, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => { setSearchQuery(term); setDebouncedQuery(term); }}
            >
              <Text style={styles.historyItem}>🔍 {term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category Chips */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50, marginBottom: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedCategory === item.name && styles.chipActive]}
            onPress={() => setSelectedCategory(item.name)}
          >
            <Text style={[styles.chipText, selectedCategory === item.name && styles.chipTextActive]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Menu List */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No delicious matches found for "{searchQuery}".</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => dispatch({ type: "ADD_ITEM", payload: item })}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Back to Top Floating Button */}
      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopButton}
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>↑ Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
  debugBadge: { position: "absolute", top: 5, right: 10, zIndex: 10, backgroundColor: "#333", padding: 4, borderRadius: 4 },
  debugText: { color: "#fff", fontSize: 10 },
  searchContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, backgroundColor: "#fff", marginBottom: 10, marginTop: 25 },
  searchInput: { flex: 1, height: 40 },
  clearText: { color: "#FF6347", fontWeight: "bold", marginLeft: 5 },
  historyContainer: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 10, elevation: 2 },
  historyTitle: { fontSize: 12, fontWeight: "bold", color: "#666", marginBottom: 5 },
  historyItem: { paddingVertical: 4, color: "#007BFF" },
  chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#e2e2e2", borderRadius: 20, marginRight: 10, height: 38 },
  chipActive: { backgroundColor: "#FF6347" },
  chipText: { color: "#333", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, alignItems: "center", elevation: 2 },
  image: { width: 70, height: 70, borderRadius: 8 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  desc: { color: "#666", fontSize: 12, marginVertical: 4 },
  price: { color: "#FF6347", fontWeight: "bold", fontSize: 14 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { color: "#666", textAlign: "center", fontSize: 16 },
  scrollTopButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#FF6347", width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center", elevation: 5 },
  addButton: { backgroundColor: "#FF6347", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginLeft: 8 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
});