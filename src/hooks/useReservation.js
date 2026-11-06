import { useState } from "react";

const mockTables = [
  { id: "t1", tableNumber: 1, capacity: 2 },
  { id: "t2", tableNumber: 2, capacity: 4 },
  { id: "t3", tableNumber: 3, capacity: 6 },
  { id: "t4", tableNumber: 4, capacity: 12 },
];

export function useReservation() {
  const [reservations, setReservations] = useState([]);

  const checkAvailability = (date, timeSlot, partySize) => {
    // Check available tables matching capacity
    const suitableTables = mockTables.filter((t) => t.capacity >= partySize);
    const bookedTableIds = reservations
      .filter((r) => r.date === date && r.timeSlot === timeSlot && r.status === "Confirmed")
      .map((r) => r.tableId);

    return suitableTables.some((t) => !bookedTableIds.includes(t.id));
  };

  const createReservation = (reservationData) => {
    const newReservation = {
      id: "res_" + Date.now(),
      ...reservationData,
      status: "Confirmed",
    };
    setReservations((prev) => [...prev, newReservation]);
    return newReservation;
  };

  const cancelReservation = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r))
    );
  };

  return { reservations, checkAvailability, createReservation, cancelReservation, mockTables };
}