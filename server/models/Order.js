const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  type: { type: String, enum: ['Dine-in', 'Takeaway'], required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'], 
    default: 'Pending' 
  },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);