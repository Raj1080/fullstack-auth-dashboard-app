// backend/controllers/tasksController.js
const Task = require('../models/Task');

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const task = await Task.create({
      title,
      description: description || '',
      owner: req.userId
    });

    res.status(201).json({ ok: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all tasks for user (with search/filter query)
exports.getTasks = async (req, res) => {
  try {
    const { q, completed } = req.query;
    const filter = { owner: req.userId };

    if (completed === 'true') filter.completed = true;
    if (completed === 'false') filter.completed = false;
    if (q) filter.title = new RegExp(q, 'i'); // simple search

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ ok: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      updates,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json({ ok: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!task) return res.status(404).json({ error: 'Not found or not authorized' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
