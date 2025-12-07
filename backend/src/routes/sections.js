const express = require('express');
const { Section } = require('../models');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// Create a section
router.post('/', async (req, res) => {
  try {
    const section = await Section.create({ ...req.body, userId: req.user.id });
    res.status(201).json(section);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create section' });
  }
});

// Get all sections for user
router.get('/', async (req, res) => {
  try {
    const sections = await Section.findAll({ where: { userId: req.user.id } });
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch sections' });
  }
});

// Get section by id
router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!section) return res.status(404).json({ message: 'Section not found' });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch section' });
  }
});

// Update section
router.put('/:id', async (req, res) => {
  try {
    const section = await Section.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await section.update(req.body);
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to update section' });
  }
});

// Delete section
router.delete('/:id', async (req, res) => {
  try {
    const section = await Section.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!section) return res.status(404).json({ message: 'Section not found' });
    await section.destroy();
    res.json({ message: 'Section deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to delete section' });
  }
});

module.exports = router;
