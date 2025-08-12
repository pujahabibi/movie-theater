const prisma = require('../db/prisma');
const Snack = require('../../domain/entities/Snack');

class SnackRepository {
  async findAll() {
    const snacks = await prisma.snack.findMany({
      where: { available: true },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    return snacks.map(snack => new Snack(snack));
  }

  async findById(id) {
    const snack = await prisma.snack.findUnique({
      where: { id }
    });
    return snack ? new Snack(snack) : null;
  }

  async findByIds(ids) {
    const snacks = await prisma.snack.findMany({
      where: {
        id: { in: ids },
        available: true
      }
    });
    return snacks.map(snack => new Snack(snack));
  }
}

module.exports = SnackRepository;