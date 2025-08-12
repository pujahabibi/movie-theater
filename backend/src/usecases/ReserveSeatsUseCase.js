const SeatRepository = require('../infra/repositories/SeatRepository');
const { v4: uuidv4 } = require('uuid');

class ReserveSeatsUseCase {
  constructor() {
    this.seatRepository = new SeatRepository();
  }

  async execute(seatIds, customerEmail) {
    // First check if seats are available
    const seats = await this.seatRepository.findByIds(seatIds);
    
    const unavailableSeats = seats.filter(seat => !seat.isAvailable);
    if (unavailableSeats.length > 0) {
      throw new Error(`Seats are no longer available: ${unavailableSeats.map(s => `${s.seatRow}${s.seatNumber}`).join(', ')}`);
    }

    // Reserve the seats
    const reservationId = uuidv4();
    await this.seatRepository.reserveSeats(seatIds, `${customerEmail}:${reservationId}`);

    return {
      reservationId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
    };
  }
}

module.exports = ReserveSeatsUseCase;