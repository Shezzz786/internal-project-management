const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authService.registerUser(username, password);
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.loginUser(username, password);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
