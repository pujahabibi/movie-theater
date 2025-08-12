const BookingRepository = require('../infra/repositories/BookingRepository');
const SeatRepository = require('../infra/repositories/SeatRepository');
const SnackRepository = require('../infra/repositories/SnackRepository');
const ShowtimeRepository = require('../infra/repositories/ShowtimeRepository');

class CreateBookingUseCase {
  constructor() {
    this.bookingRepository = new BookingRepository();
    this.seatRepository = new SeatRepository();
    this.snackRepository = new SnackRepository();
    this.showtimeRepository = new ShowtimeRepository();
  }

  async execute({
    showtimeId,
    customerName,
    customerEmail,
    customerPhone,
    seatIds = [],
    snackItems = [] // [{ snackId, quantity }]
  }) {
    // Validate showtime exists
    const showtime = await this.showtimeRepository.findById(showtimeId);
    if (!showtime) {
      throw new Error('Showtime not found');
    }

    // Validate seats are still available
    if (seatIds.length > 0) {
      const seats = await this.seatRepository.findByIds(seatIds);
      const unavailableSeats = seats.filter(seat => !seat.isAvailable);
      if (unavailableSeats.length > 0) {
        throw new Error(`Seats are no longer available: ${unavailableSeats.map(s => `${s.seatRow}${s.seatNumber}`).join(', ')}`);
      }
    }

    // Validate snacks exist and are available
    let snacks = [];
    if (snackItems.length > 0) {
      const snackIds = snackItems.map(item => item.snackId);
      snacks = await this.snackRepository.findByIds(snackIds);
      if (snacks.length !== snackIds.length) {
        throw new Error('Some snacks are not available');
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    
    // Add seat prices
    if (seatIds.length > 0) {
      totalAmount += parseFloat(showtime.movie.price) * seatIds.length;
    }
    
    // Add snack prices
    snackItems.forEach(item => {
      const snack = snacks.find(s => s.id === item.snackId);
      if (snack) {
        totalAmount += parseFloat(snack.price) * item.quantity;
      }
    });

    // Create the booking
    const booking = await this.bookingRepository.create(
      {
        showtimeId,
        customerName,
        customerEmail,
        customerPhone,
        totalAmount,
        status: 'confirmed'
      },
      seatIds,
      snackItems
    );

    return booking;
  }
}

module.exports = CreateBookingUseCase;