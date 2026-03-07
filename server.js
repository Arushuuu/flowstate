const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Ensure MongoDB is running on your PC)
mongoose.connect('mongodb://127.0.0.1:27017/flowstate')
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avgPeriodDuration: { type: Number, default: 5 } 
});

const User = mongoose.model('User', userSchema);

// 3. Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, age, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, age, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "Account Created!" });
    } catch (err) {
        res.status(400).json({ message: "Email already exists." });
    }
});

// 4. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ user: { name: user.name, age: user.age, duration: user.avgPeriodDuration } });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));