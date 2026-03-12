var express = require('express');
var router = express.Router();
var Role = require('../schemas/roles');
var User = require('../schemas/users');

// 1) CRUD for Role

// Create Role
router.post('/', async function(req, res, next) {
  try {
    let newRole = new Role(req.body);
    let savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read (Get all)
router.get('/', async function(req, res, next) {
  try {
    let roles = await Role.find({ isDeleted: false });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read (Get by id)
router.get('/:id', async function(req, res, next) {
  try {
    let role = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Role
router.put('/:id', async function(req, res, next) {
  try {
    let role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Soft Delete Role
router.delete('/:id', async function(req, res, next) {
  try {
    let role = await Role.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(200).json({ message: 'Role deleted successfully', role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4) GET /roles/:id/users - Get all users by Role ID
router.get('/:id/users', async function(req, res, next) {
  try {
    // Optional: Check if Role exists
    let roleExists = await Role.findOne({ _id: req.params.id, isDeleted: false });
    if (!roleExists) {
      return res.status(404).json({ error: 'Role not found' });
    }

    let users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
