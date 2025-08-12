const MovieRepository = require('../infra/repositories/MovieRepository');

class GetMoviesUseCase {
  constructor() {
    this.movieRepository = new MovieRepository();
  }

  async execute() {
    return await this.movieRepository.findAll();
  }
}

module.exports = GetMoviesUseCase;