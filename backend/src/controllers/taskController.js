const taskService = require('../services/taskService');
const { getIo } = require('../sockets'); 

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.params.projectId, req.body);
    
    // Emit real-time event
    const io = getIo();
    io.to(req.params.projectId).emit('task_created', task);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    
    // Emit real-time event
    const io = getIo();
    io.to(task.projectId.toString()).emit('task_updated', task);

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id);
    
    // Emit real-time event
    const io = getIo();
    io.to(task.projectId.toString()).emit('task_deleted', task._id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
