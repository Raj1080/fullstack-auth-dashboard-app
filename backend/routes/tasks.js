// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const tasks = require('../controllers/tasksController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth); // protect all task routes

router.post('/', tasks.createTask);
router.get('/', tasks.getTasks);
router.get('/:id', tasks.getTask);
router.put('/:id', tasks.updateTask);
router.delete('/:id', tasks.deleteTask);

module.exports = router;
