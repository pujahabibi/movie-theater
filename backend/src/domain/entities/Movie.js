class Movie {
  constructor({
    id,
    title,
    description,
    duration,
    genre,
    posterUrl,
    rating,
    price,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.genre = genre;
    this.posterUrl = posterUrl;
    this.rating = rating;
    this.price = parseFloat(price);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      duration: this.duration,
      genre: this.genre,
      posterUrl: this.posterUrl,
      rating: this.rating,
      price: this.price,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Movie;