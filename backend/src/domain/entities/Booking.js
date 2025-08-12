class Booking {
  constructor({
    id,
    showtimeId,
    customerName,
    customerEmail,
    customerPhone,
    totalAmount,
    status,
    bookingDate,
    showtime,
    bookingSeats,
    bookingSnacks
  }) {
    this.id = id;
    this.showtimeId = showtimeId;
    this.customerName = customerName;
    this.customerEmail = customerEmail;
    this.customerPhone = customerPhone;
    this.totalAmount = parseFloat(totalAmount);
    this.status = status;
    this.bookingDate = bookingDate;
    this.showtime = showtime;
    this.bookingSeats = bookingSeats || [];
    this.bookingSnacks = bookingSnacks || [];
  }

  toJSON() {
    return {
      id: this.id,
      showtimeId: this.showtimeId,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      totalAmount: this.totalAmount,
      status: this.status,
      bookingDate: this.bookingDate,
      showtime: this.showtime ? (this.showtime.toJSON ? this.showtime.toJSON() : this.showtime) : undefined,
      seats: this.bookingSeats.map(bs => bs.seat ? (bs.seat.toJSON ? bs.seat.toJSON() : bs.seat) : bs),
      snacks: this.bookingSnacks.map(bs => ({
        snack: bs.snack ? (bs.snack.toJSON ? bs.snack.toJSON() : bs.snack) : bs,
        quantity: bs.quantity
      }))
    };
  }
}

module.exports = Booking;