const Task = require('../models/Task');

const createTask = async (projectId, data) => {
  return await Task.create({ ...data, projectId });
};

const updateTask = async (taskId, data) => {
  const task = await Task.findByIdAndUpdate(taskId, data, { new: true });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return task;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return task;
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
