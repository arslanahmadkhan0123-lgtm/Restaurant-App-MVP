const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    await Reservation.deleteMany();
    await Order.deleteMany();

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Users
    const users = await User.insertMany([
      { name: 'Arslan Customer', email: 'customer@test.com', password: hashedPassword, role: 'customer' },
      { name: 'Manager Arslan', email: 'manager@test.com', password: hashedPassword, role: 'manager' }
    ]);

    // Create Menu Items (15 items)
    await MenuItem.insertMany([
      { name: 'Garlic Bread', description: 'Crispy toasted bread with fresh garlic butter', price: 450, category: 'Starters', isSpecial: false, isAvailable: true },
      { name: 'Chicken Wings', description: 'Spicy buffalo glazed wings', price: 750, category: 'Starters', isSpecial: true, isAvailable: true },
      { name: 'Soup of the Day', description: 'Freshly made seasonal vegetable soup', price: 400, category: 'Starters', isSpecial: false, isAvailable: true },
      { name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with tomatoes', price: 500, category: 'Starters', isSpecial: false, isAvailable: false },
      { name: 'Margherita Pizza', description: 'Classic mozzarella, tomato sauce & fresh basil', price: 1200, category: 'Mains', isSpecial: false, isAvailable: true },
      { name: 'Zinger Burger', description: 'Crispy fried chicken breast with iceberg lettuce', price: 850, category: 'Mains', isSpecial: true, isAvailable: true },
      { name: 'Fettuccine Alfredo', description: 'Creamy parmesan sauce with grilled chicken', price: 1350, category: 'Mains', isSpecial: false, isAvailable: true },
      { name: 'Beef Stake', description: 'Prime cut beef served with black pepper sauce', price: 2200, category: 'Mains', isSpecial: true, isAvailable: true },
      { name: 'Club Sandwich', description: 'Triple decker sandwich with chicken and egg', price: 700, category: 'Mains', isSpecial: false, isAvailable: true },
      { name: 'Chocolate Lava Cake', description: 'Warm gooey chocolate center served with vanilla ice cream', price: 650, category: 'Desserts', isSpecial: true, isAvailable: true },
      { name: 'New York Cheesecake', description: 'Classic rich creamy cheesecake', price: 750, category: 'Desserts', isSpecial: false, isAvailable: true },
      { name: 'Tiramisu', description: 'Coffee-flavoured Italian dessert', price: 800, category: 'Desserts', isSpecial: false, isAvailable: true },
      { name: 'Fresh Mint Lemonade', description: 'Chilled refreshing lemon mint drink', price: 300, category: 'Drinks', isSpecial: false, isAvailable: true },
      { name: 'Cold Coffee', description: 'Blended espresso with milk and ice cream', price: 450, category: 'Drinks', isSpecial: false, isAvailable: true },
      { name: 'Iced Peach Tea', description: 'Freshly brewed black tea infused with peach syrup', price: 350, category: 'Drinks', isSpecial: false, isAvailable: true }
    ]);

    // Create Tables (6 tables)
    await Table.insertMany([
      { tableNumber: 1, capacity: 2, isAvailable: true },
      { tableNumber: 2, capacity: 2, isAvailable: true },
      { tableNumber: 3, capacity: 4, isAvailable: true },
      { tableNumber: 4, capacity: 4, isAvailable: true },
      { tableNumber: 5, capacity: 6, isAvailable: true },
      { tableNumber: 6, capacity: 8, isAvailable: true }
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();