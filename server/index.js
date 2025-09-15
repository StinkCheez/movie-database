require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, email, password: hash });
    res.json({ message: 'User registered', user: { username: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username }, jwtSecret, { expiresIn: '1h' });
  res.json({ token, username: user.username });
});

app.listen(port, () => console.log(`Server running on port ${port}`));