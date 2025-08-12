const prisma = require('../db/prisma');
const Movie = require('../../domain/entities/Movie');

class MovieRepository {
  async findAll() {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return movies.map(movie => new Movie(movie));
  }

  async findById(id) {
    const movie = await prisma.movie.findUnique({
      where: { id }
    });
    return movie ? new Movie(movie) : null;
  }

  async create(movieData) {
    const movie = await prisma.movie.create({
      data: movieData
    });
    return new Movie(movie);
  }

  async update(id, movieData) {
    const movie = await prisma.movie.update({
      where: { id },
      data: movieData
    });
    return new Movie(movie);
  }

  async delete(id) {
    await prisma.movie.delete({
      where: { id }
    });
  }
}

module.exports = MovieRepository;