const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { projectSchema, taskSchema } = require('../validations');

router.use(auth); // All project routes require auth

router.route('/')
  .get(projectController.getProjects)
  .post(validate(projectSchema), projectController.createProject);

router.route('/:id')
  .get(projectController.getProject);

// Nested route for tasks under a project
router.route('/:projectId/tasks')
  .post(validate(taskSchema), taskController.createTask);

module.exports = router;
