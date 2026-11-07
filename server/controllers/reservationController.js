const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ isAvailable: true }).sort({ tableNumber: 1 });
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { tableId, date, timeSlot, partySize } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table.capacity < partySize) {
      return res.status(400).json({ message: `Table capacity (${table.capacity}) is smaller than party size (${partySize})` });
    }

    // Check availability conflict
    const existingBooking = await Reservation.findOne({
      tableId,
      date,
      timeSlot,
      status: { $ne: 'Declined' }
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Table is already booked for this date and time slot' });
    }

    const reservation = await Reservation.create({
      userId: req.user._id,
      tableId,
      date,
      timeSlot,
      partySize
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id }).populate('tableId').sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('userId', 'name email').populate('tableId').sort({ createdAt: -1 });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Declined'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};