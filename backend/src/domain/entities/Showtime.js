class Showtime {
  constructor({
    id,
    movieId,
    startTime,
    theaterRoom,
    totalSeats,
    createdAt,
    movie
  }) {
    this.id = id;
    this.movieId = movieId;
    this.startTime = startTime;
    this.theaterRoom = theaterRoom;
    this.totalSeats = totalSeats;
    this.createdAt = createdAt;
    this.movie = movie;
  }

  toJSON() {
    return {
      id: this.id,
      movieId: this.movieId,
      startTime: this.startTime,
      theaterRoom: this.theaterRoom,
      totalSeats: this.totalSeats,
      createdAt: this.createdAt,
      movie: this.movie ? this.movie.toJSON ? this.movie.toJSON() : this.movie : undefined
    };
  }
}

module.exports = Showtime;