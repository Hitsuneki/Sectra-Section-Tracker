const express = require('express');
const { Student } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Create a student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create({ ...req.body, userId: req.user.id });
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create student' });
  }
});

// Get all students for user
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll({ where: { userId: req.user.id } });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get student by id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to delete student' });
  }
});

module.exports = router;
