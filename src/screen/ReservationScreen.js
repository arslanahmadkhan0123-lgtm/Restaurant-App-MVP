import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal } from "react-native";
import { useReservation } from "../hooks/useReservation";
import { useForm } from "../hooks/useForm";

const timeSlots = ["12:00", "13:00", "14:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

export default function ReservationScreen() {
  const { reservations, checkAvailability, createReservation, cancelReservation, mockTables } = useReservation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const validate = (vals) => {
    let errs = {};
    const phoneRegex = /^03\d{2}-\d{7}$/;
    if (!vals.date) errs.date = "Date is required (YYYY-MM-DD)";
    if (!vals.partySize || vals.partySize < 1 || vals.partySize > 12) errs.partySize = "Party size must be 1-12";
    if (!phoneRegex.test(vals.phone)) errs.phone = "Phone must match 03XX-XXXXXXX format";
    return errs;
  };

  const { values, errors, handleChange } = useForm(
    { date: "2026-11-10", timeSlot: "19:00", partySize: "2", phone: "0300-1234567" },
    validate
  );

  const handleAttemptBooking = () => {
    if (Object.keys(errors).length > 0) {
      Alert.alert("Validation Error", "Please correct the form errors.");
      return;
    }
    const isFree = checkAvailability(values.date, values.timeSlot, parseInt(values.partySize));
    if (!isFree) {
      Alert.alert("Fully Booked", "No tables available for this slot and party size.");
      return;
    }
    const table = mockTables.find((t) => t.capacity >= parseInt(values.partySize));
    setPendingBooking({ ...values, tableId: table.id, tableNum: table.tableNumber });
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    try {
      await createReservation(pendingBooking);
      setShowConfirmModal(false);
      Alert.alert("Success", "Table reserved successfully!");
    } catch (error) {
      setShowConfirmModal(false);
      Alert.alert("Reservation Failed", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book a Table</Text>
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={values.date}
        onChangeText={(val) => handleChange("date", val)}
      />
      {errors.date && <Text style={styles.err}>{errors.date}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Party Size (1-12)"
        keyboardType="numeric"
        value={values.partySize}
        onChangeText={(val) => handleChange("partySize", val)}
      />
      {errors.partySize && <Text style={styles.err}>{errors.partySize}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Phone (03XX-XXXXXXX)"
        value={values.phone}
        onChangeText={(val) => handleChange("phone", val)}
      />
      {errors.phone && <Text style={styles.err}>{errors.phone}</Text>}

      <Text style={styles.subtitle}>Select Time Slot:</Text>
      <View style={styles.slotContainer}>
        {timeSlots.map((slot) => {
          const available = checkAvailability(values.date, slot, parseInt(values.partySize || 1));
          return (
            <TouchableOpacity
              key={slot}
              style={[styles.slotBtn, values.timeSlot === slot && styles.slotActive, !available && styles.slotDisabled]}
              disabled={!available}
              onPress={() => handleChange("timeSlot", slot)}
            >
              <Text style={[{ color: "#333" }, !available && { color: "#999" }]}>{slot}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.mainBtn} onPress={handleAttemptBooking}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Review Reservation</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Confirm Booking</Text>
            <Text>Date: {pendingBooking?.date}</Text>
            <Text>Time: {pendingBooking?.timeSlot}</Text>
            <Text>Party Size: {pendingBooking?.partySize}</Text>
            <Text>Table Number: #{pendingBooking?.tableNum}</Text>
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: "green" }]} onPress={confirmBooking}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirm & Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={{ marginTop: 10, alignItems: "center" }}>
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  subtitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  err: { color: "red", fontSize: 12, marginBottom: 5 },
  slotContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  slotBtn: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, width: "22%", alignItems: "center" },
  slotActive: { backgroundColor: "#FF6347", borderColor: "#FF6347" },
  slotDisabled: { backgroundColor: "#e2e2e2", borderColor: "#dcdcdc" },
  mainBtn: { backgroundColor: "#FF6347", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 15 },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 20 },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
});