const express = require('express');
const RegisterUserUseCase = require('../../../usecases/RegisterUserUseCase');
const LoginUserUseCase = require('../../../usecases/LoginUserUseCase');

const router = express.Router();

const registerUserUseCase = new RegisterUserUseCase();
const loginUserUseCase = new LoginUserUseCase();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const user = await registerUserUseCase.execute(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = await loginUserUseCase.execute(email, password);
    res.status(200).json(result);
  } catch (error) {
    // For login, send a more generic error message
    res.status(401).json({ error: 'Invalid credentials.' });
  }
});

module.exports = router;

