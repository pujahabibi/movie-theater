const SeatRepository = require('../infra/repositories/SeatRepository');

class GetSeatsUseCase {
  constructor() {
    this.seatRepository = new SeatRepository();
  }

  async execute(showtimeId) {
    // Clear expired reservations first
    await this.seatRepository.clearExpiredReservations();
    
    const seats = await this.seatRepository.findByShowtimeId(showtimeId);
    
    // Group seats by row for easier frontend rendering
    const seatMap = {};
    seats.forEach(seat => {
      if (!seatMap[seat.seatRow]) {
        seatMap[seat.seatRow] = [];
      }
      seatMap[seat.seatRow].push(seat);
    });

    return {
      seats,
      seatMap
    };
  }
}

module.exports = GetSeatsUseCase;