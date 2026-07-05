const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
});

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  status: Joi.string().valid('Todo', 'In Progress', 'Done'),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(''),
  status: Joi.string().valid('Todo', 'In Progress', 'Done'),
});

module.exports = {
  registerSchema,
  loginSchema,
  projectSchema,
  taskSchema,
  taskUpdateSchema,
};
