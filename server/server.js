const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect Database
connectDB().then(async () => {
  if (global.__USING_MEMORY_DB__) {
    const User = require('./models/User');
    const MenuItem = require('./models/MenuItem');
    const Table = require('./models/Table');
    const bcrypt = require('bcryptjs');

    if (await User.countDocuments() === 0) {
      const password = await bcrypt.hash('password123', 10);
      await User.insertMany([
        { name: 'Customer', email: 'customer@test.com', password, role: 'customer' },
        { name: 'Manager', email: 'manager@test.com', password, role: 'manager' }
      ]);
    }
    if (await MenuItem.countDocuments() === 0) {
      const seedMenu = [
        ['Garlic Bread', 'Crispy toasted bread with garlic butter', 450, 'Starters', true],
        ['Bruschetta', 'Grilled bread with tomatoes', 500, 'Starters', true],
        ['Margherita Pizza', 'Mozzarella, tomato sauce and basil', 1200, 'Mains', true],
        ['Zinger Burger', 'Crispy chicken with lettuce', 850, 'Mains', true],
        ['Fettuccine Alfredo', 'Creamy parmesan pasta with chicken', 1350, 'Mains', true],
        ['Chocolate Lava Cake', 'Warm chocolate cake', 650, 'Desserts', true],
        ['New York Cheesecake', 'Classic creamy cheesecake', 750, 'Desserts', true],
        ['Fresh Mint Lemonade', 'Chilled lemon and mint drink', 300, 'Drinks', true]
      ];
      await MenuItem.insertMany(seedMenu.map(([name, description, price, category, isAvailable]) =>
        ({ name, description, price, category, isAvailable })
      ));
    }
    if (await Table.countDocuments() === 0) {
      await Table.insertMany([
        { tableNumber: 1, capacity: 2 },
        { tableNumber: 2, capacity: 4 },
        { tableNumber: 3, capacity: 6 },
        { tableNumber: 4, capacity: 8 }
      ]);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});