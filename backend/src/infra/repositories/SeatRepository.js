const prisma = require('../db/prisma');
const Seat = require('../../domain/entities/Seat');

class SeatRepository {
  async findByShowtimeId(showtimeId) {
    const seats = await prisma.seat.findMany({
      where: { showtimeId },
      orderBy: [
        { seatRow: 'asc' },
        { seatNumber: 'asc' }
      ]
    });
    return seats.map(seat => new Seat(seat));
  }

  async findById(id) {
    const seat = await prisma.seat.findUnique({
      where: { id }
    });
    return seat ? new Seat(seat) : null;
  }

  async findByIds(ids) {
    const seats = await prisma.seat.findMany({
      where: {
        id: { in: ids }
      }
    });
    return seats.map(seat => new Seat(seat));
  }

  async reserveSeats(seatIds, reservedBy) {
    const now = new Date();
    await prisma.seat.updateMany({
      where: {
        id: { in: seatIds },
        isOccupied: false
      },
      data: {
        reservedAt: now,
        reservedBy
      }
    });
  }

  async occupySeats(seatIds) {
    await prisma.seat.updateMany({
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

  async clearExpiredReservations() {
    const cutoffTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
    await prisma.seat.updateMany({
      where: {
        reservedAt: {
          lt: cutoffTime
        },
        isOccupied: false
      },
      data: {
        reservedAt: null,
        reservedBy: null
      }
    });
  }
}

module.exports = SeatRepository;