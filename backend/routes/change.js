const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth'); // Your JWT middleware
const User = require('../models/User');

router.put('/', auth, async (req, res) => {
  const { op, np, email } = req.body;

  try {
    //  Find user by email 
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare Old Password  with hashed password in DB
    const isMatch = await bcrypt.compare(op, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    //  Hash the New Password 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(np, salt);

    //  Save to Database
    await user.save();

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;