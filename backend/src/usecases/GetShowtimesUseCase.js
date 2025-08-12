const ShowtimeRepository = require('../infra/repositories/ShowtimeRepository');

class GetShowtimesUseCase {
  constructor() {
    this.showtimeRepository = new ShowtimeRepository();
  }

  async execute(movieId) {
    if (!movieId) {
      return await this.showtimeRepository.findUpcoming();
    }
    return await this.showtimeRepository.findByMovieId(movieId);
  }
}

module.exports = GetShowtimesUseCase;