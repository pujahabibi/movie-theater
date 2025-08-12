const prisma = require('../db/prisma');
const Showtime = require('../../domain/entities/Showtime');
const Movie = require('../../domain/entities/Movie');

class ShowtimeRepository {
  async findByMovieId(movieId) {
    const showtimes = await prisma.showtime.findMany({
      where: { movieId },
      include: { movie: true },
      orderBy: { startTime: 'asc' }
    });
    
    return showtimes.map(showtime => new Showtime({
      ...showtime,
      movie: new Movie(showtime.movie)
    }));
  }

  async findById(id) {
    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: { movie: true }
    });
    
    return showtime ? new Showtime({
      ...showtime,
      movie: new Movie(showtime.movie)
    }) : null;
  }

  async findUpcoming() {
    const now = new Date();
    const showtimes = await prisma.showtime.findMany({
      where: {
        startTime: {
          gte: now
        }
      },
      include: { movie: true },
      orderBy: { startTime: 'asc' }
    });
    
    return showtimes.map(showtime => new Showtime({
      ...showtime,
      movie: new Movie(showtime.movie)
    }));
  }
}

module.exports = ShowtimeRepository;