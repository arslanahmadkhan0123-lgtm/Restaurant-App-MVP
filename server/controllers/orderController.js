const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.createOrder = async (req, res) => {
  try {
    const { items, type, tableId } = req.body;
    if (!['Dine-in', 'Takeaway'].includes(type)) {
      return res.status(400).json({ message: 'Type must be Dine-in or Takeaway' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    // NOTE ON TOTAL CALCULATION:
    // We calculate the order total strictly on the server by fetching prices directly from 
    // MongoDB. This prevents malicious users from tampering with request payloads to lower prices.
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ message: 'Each item quantity must be a positive integer' });
      }
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `Item not found: ${item.menuItemId}` });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `Item '${menuItem.name}' is currently unavailable` });
      }

      calculatedTotal += menuItem.price * item.quantity;
      validatedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        notes: item.notes || ''
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      items: validatedItems,
      total: calculatedTotal,
      type,
      tableId: type === 'Dine-in' ? tableId : undefined
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const statusFlow = ['Pending', 'Preparing', 'Ready', 'Served'];

    if (status === 'Cancelled') {
      if (order.status !== 'Pending') {
        return res.status(400).json({ message: 'Orders can only be cancelled while Pending' });
      }
    } else {
      const currentIndex = statusFlow.indexOf(order.status);
      const nextIndex = statusFlow.indexOf(status);

      if (nextIndex === -1 || nextIndex !== currentIndex + 1) {
        return res.status(400).json({ 
          message: `Invalid status transition from ${order.status} to ${status}` 
        });
      }
    }

    order.status = status;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};