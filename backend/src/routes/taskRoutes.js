const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { taskUpdateSchema } = require('../validations');

router.use(auth); // All task routes require auth

router.route('/:id')
  .put(validate(taskUpdateSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
