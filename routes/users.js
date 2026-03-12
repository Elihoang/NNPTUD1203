var express = require('express');
var router = express.Router();
var User = require('../schemas/users');
var Role = require('../schemas/roles'); // Added to ensure role schema is registered

// 1) CRUD for User

// Create User
router.post('/', async function(req, res, next) {
  try {
    let newUser = new User(req.body);
    let savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read (Get all)
router.get('/', async function(req, res, next) {
  try {
    let users = await User.find({ isDeleted: false }).populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (Get by id)
router.get('/:id', async function(req, res, next) {
  try {
    let user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User
router.put('/:id', async function(req, res, next) {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Soft Delete User
router.delete('/:id', async function(req, res, next) {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2) POST /enable - Enable User status = true
router.post('/enable', async function(req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found with matching email and username' });
    }
    res.status(200).json({ message: 'User enabled successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3) POST /disable - Disable User status = false
router.post('/disable', async function(req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await User.findOneAndUpdate(
      { email, username, isDeleted: false },
      { status: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found with matching email and username' });
    }
    res.status(200).json({ message: 'User disabled successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
