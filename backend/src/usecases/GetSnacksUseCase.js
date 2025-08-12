const SnackRepository = require('../infra/repositories/SnackRepository');

class GetSnacksUseCase {
  constructor() {
    this.snackRepository = new SnackRepository();
  }

  async execute() {
    const snacks = await this.snackRepository.findAll();
    
    // Group snacks by category
    const categories = {};
    snacks.forEach(snack => {
      if (!categories[snack.category]) {
        categories[snack.category] = [];
      }
      categories[snack.category].push(snack);
    });

    return {
      snacks,
      categories
    };
  }
}

module.exports = GetSnacksUseCase;