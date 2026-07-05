const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const redisCache = require('../middleware/redisCache');
const { projectSchema, taskSchema } = require('../validations');

router.use(auth); // All project routes require auth

router.route('/')
  .get(redisCache(60), projectController.getProjects)
  .post(validate(projectSchema), projectController.createProject);

router.route('/:id')
  .get(redisCache(60), projectController.getProject);

// Nested route for tasks under a project
router.route('/:projectId/tasks')
  .post(validate(taskSchema), taskController.createTask);

module.exports = router;
