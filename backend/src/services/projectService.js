const Project = require('../models/Project');
const Task = require('../models/Task');

const createProject = async (data) => {
  return await Project.create(data);
};

const getAllProjects = async () => {
  return await Project.find().sort({ createdAt: -1 });
};

const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
  return { project, tasks };
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
};
