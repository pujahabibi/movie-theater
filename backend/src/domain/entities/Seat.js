class Seat {
  constructor({
    id,
    showtimeId,
    seatRow,
    seatNumber,
    seatType,
    isOccupied,
    reservedAt,
    reservedBy
  }) {
    this.id = id;
    this.showtimeId = showtimeId;
    this.seatRow = seatRow;
    this.seatNumber = seatNumber;
    this.seatType = seatType;
    this.isOccupied = isOccupied;
    this.reservedAt = reservedAt;
    this.reservedBy = reservedBy;
  }

  get isAvailable() {
    return !this.isOccupied && !this.isReserved;
  }

  get isReserved() {
    if (!this.reservedAt) return false;
    const now = new Date();
    const reservationTime = new Date(this.reservedAt);
    const minutesSinceReservation = (now - reservationTime) / (1000 * 60);
    return minutesSinceReservation < 15; // 15 minute reservation timeout
  }

  toJSON() {
    return {
      id: this.id,
      showtimeId: this.showtimeId,
      seatRow: this.seatRow,
      seatNumber: this.seatNumber,
      seatType: this.seatType,
      isOccupied: this.isOccupied,
      isReserved: this.isReserved,
      isAvailable: this.isAvailable,
      reservedAt: this.reservedAt,
      reservedBy: this.reservedBy
    };
  }
}

module.exports = Seat;