import { useEffect, useState } from "react";
import { apiClient } from "../api/client";

export function useReservation() {
  const [reservations, setReservations] = useState([]);
  const [mockTables, setTables] = useState([]);

  useEffect(() => {
    Promise.all([
      apiClient("/reservations/tables"),
      apiClient("/reservations/my"),
    ])
      .then(([tables, existingReservations]) => {
        setTables(tables.map((table) => ({ ...table, id: table._id || table.id })));
        setReservations(existingReservations.map((reservation) => ({
          ...reservation,
          id: reservation._id || reservation.id,
          tableId: reservation.tableId?._id || reservation.tableId,
        })));
      })
      .catch(() => {
        setTables([]);
        setReservations([]);
      });
  }, []);

  const checkAvailability = (date, timeSlot, partySize) => {
    // Check available tables matching capacity
    const suitableTables = mockTables.filter((t) => t.capacity >= partySize);
    const bookedTableIds = reservations
      .filter((r) => r.date === date && r.timeSlot === timeSlot && r.status !== "Declined" && r.status !== "Cancelled")
      .map((r) => r.tableId);

    return suitableTables.some((t) => !bookedTableIds.includes(t.id));
  };

  const createReservation = async (reservationData) => {
    const newReservation = await apiClient("/reservations", "POST", {
      tableId: reservationData.tableId,
      date: reservationData.date,
      timeSlot: reservationData.timeSlot,
      partySize: parseInt(reservationData.partySize),
    });
    newReservation.id = newReservation._id || newReservation.id;
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