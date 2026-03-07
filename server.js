require('dotenv').config(); // Loads your MONGO_URI from the .env file
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB Atlas
// Ensure your .env file contains: MONGO_URI=your_connection_string
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Successfully connected to MongoDB Atlas!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. User Schema (Including Period Duration Tracking)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avgPeriodDuration: { type: Number, default: 5 } 
});

const User = mongoose.model('User', userSchema);

// 3. Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, age, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, age, email, password: hashedPassword });
        await user.save();
        
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during signup" });
    }
});

// 4. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Send back user data (excluding password)
        res.json({ 
            user: { 
                name: user.name, 
                age: user.age, 
                duration: user.avgPeriodDuration 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login" });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is humming on http://localhost:${PORT}`);
});
