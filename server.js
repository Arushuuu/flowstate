const mongoose = require('mongoose');

// Connect to MongoDB (Local for now, or use MongoDB Atlas URL)
mongoose.connect('mongodb://localhost:27000/flowstate')
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Create a User Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Update your signup route to use the Database
app.post('/api/signup', async (req, res) => {
    try {
        const { name, age, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, age, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User saved to database!" });
    } catch (err) {
        res.status(400).json({ message: "Email already exists" });
    }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);

        if (!user) return res.status(400).json({ message: "User not found." });

        // Compare Hashed Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        res.json({ 
            message: "Login successful", 
            user: { name: user.name, age: user.age } 
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during login." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));