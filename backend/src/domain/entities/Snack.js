class Snack {
  constructor({
    id,
    name,
    description,
    price,
    category,
    imageUrl,
    available,
    createdAt
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = parseFloat(price);
    this.category = category;
    this.imageUrl = imageUrl;
    this.available = available;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      imageUrl: this.imageUrl,
      available: this.available,
      createdAt: this.createdAt
    };
  }
}

module.exports = Snack;