const { PrismaClient } = require('@prisma/client');
const User = require('../../domain/entities/User');

const prisma = new PrismaClient();

class UserRepository {
  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return User.fromData(user);
  }

  async create(name, email, hashedPassword) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return User.fromData(user);
  }
}

