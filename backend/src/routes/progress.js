const express = require('express');
const { Progress } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Create progress
router.post('/', async (req, res) => {
  try {
    const progress = await Progress.create({ ...req.body, userId: req.user.id });
    res.status(201).json(progress);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create progress' });
  }
});

// Get all progress entries for user
router.get('/', async (req, res) => {
  try {
    const progressEntries = await Progress.findAll({ where: { userId: req.user.id } });
    res.json(progressEntries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch progress entries' });
  }
});

// Get progress by id
router.get('/:id', async (req, res) => {
  try {
    const progress = await Progress.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!progress) return res.status(404).json({ message: 'Progress entry not found' });
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch progress entry' });
  }
});

// Update progress
router.put('/:id', async (req, res) => {
  try {
    const progress = await Progress.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!progress) return res.status(404).json({ message: 'Progress entry not found' });
    await progress.update(req.body);
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update progress entry' });
  }
});

// Delete progress
router.delete('/:id', async (req, res) => {
  try {
    const progress = await Progress.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!progress) return res.status(404).json({ message: 'Progress entry not found' });
    await progress.destroy();
    res.json({ message: 'Progress entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to delete progress entry' });
  }
});

module.exports = router;
