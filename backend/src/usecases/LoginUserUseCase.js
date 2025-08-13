const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../infra/repositories/UserRepository');
const config = require('../config/env');

class LoginUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: '1h' });

    return { user: user.toData(), token };
  }
}

module.exports = LoginUserUseCase;
