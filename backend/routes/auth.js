const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists with this email" });
    }

    //  Create new user instance
    user = new User({
      name,
      email,
      number,
      password
    });

    //  Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //  Save to MongoDB
    await user.save();

    res.status(201).json({ msg: "Registration successful!" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error during registration");
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    //  Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    //  Create JWT Payload
    const payload = {
      user: {
        id: user.id,
        name: user.name
      }
    };

    //  Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken', 
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Return both token and user data for the frontend
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email 
          } 
        });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error during login");
  }
});

module.exports = router;