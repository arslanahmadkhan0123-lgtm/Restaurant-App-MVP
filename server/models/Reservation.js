const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);