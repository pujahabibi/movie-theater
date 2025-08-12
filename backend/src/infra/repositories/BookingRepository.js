const prisma = require('../db/prisma');
const Booking = require('../../domain/entities/Booking');
const Showtime = require('../../domain/entities/Showtime');
const Movie = require('../../domain/entities/Movie');
const Seat = require('../../domain/entities/Seat');
const Snack = require('../../domain/entities/Snack');

class BookingRepository {
  async create(bookingData, seatIds, snackItems) {
    const result = await prisma.$transaction(async (tx) => {
      // Create the booking
      const booking = await tx.booking.create({
        data: {
          showtimeId: bookingData.showtimeId,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          totalAmount: bookingData.totalAmount,
          status: bookingData.status || 'confirmed'
        }
      });

      // Create booking seats
      if (seatIds && seatIds.length > 0) {
        const bookingSeats = seatIds.map(seatId => ({
          bookingId: booking.id,
          seatId
        }));
        
        await tx.bookingSeat.createMany({
          data: bookingSeats
        });

        // Mark seats as occupied
        await tx.seat.updateMany({
          where: {
            id: { in: seatIds }
          },
          data: {
            isOccupied: true,
            reservedAt: null,
            reservedBy: null
          }
        });
      }

      // Create booking snacks
      if (snackItems && snackItems.length > 0) {
        const bookingSnacks = snackItems.map(item => ({
          bookingId: booking.id,
          snackId: item.snackId,
          quantity: item.quantity
        }));
        
        await tx.bookingSnack.createMany({
          data: bookingSnacks
        });
      }

      return booking;
    });

    return this.findById(result.id);
  }

  async findById(id) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        showtime: {
          include: { movie: true }
        },
        bookingSeats: {
          include: { seat: true }
        },
        bookingSnacks: {
          include: { snack: true }
        }
      }
    });

    if (!booking) return null;

    return new Booking({
      ...booking,
      showtime: new Showtime({
        ...booking.showtime,
        movie: new Movie(booking.showtime.movie)
      }),
      bookingSeats: booking.bookingSeats.map(bs => ({
        ...bs,
        seat: new Seat(bs.seat)
      })),
      bookingSnacks: booking.bookingSnacks.map(bs => ({
        ...bs,
        snack: new Snack(bs.snack)
      }))
    });
  }

  async findByEmail(email) {
    const bookings = await prisma.booking.findMany({
      where: { customerEmail: email },
      include: {
        showtime: {
          include: { movie: true }
        },
        bookingSeats: {
          include: { seat: true }
        },
        bookingSnacks: {
          include: { snack: true }
        }
      },
      orderBy: { bookingDate: 'desc' }
    });

    return bookings.map(booking => new Booking({
      ...booking,
      showtime: new Showtime({
        ...booking.showtime,
        movie: new Movie(booking.showtime.movie)
      }),
      bookingSeats: booking.bookingSeats.map(bs => ({
        ...bs,
        seat: new Seat(bs.seat)
      })),
      bookingSnacks: booking.bookingSnacks.map(bs => ({
        ...bs,
        snack: new Snack(bs.snack)
      }))
    }));
  }
}

module.exports = BookingRepository;