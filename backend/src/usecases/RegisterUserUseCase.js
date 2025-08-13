const bcrypt = require('bcryptjs');
const UserRepository = require('../infra/repositories/UserRepository');

class RegisterUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(name, email, password) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create(name, email, hashedPassword);
    return newUser.toData();
  }
}

module.exports = RegisterUserUseCase;
