const express = require('express');
const router = express.Router();

router.post('/send-receipt', (req, res) => {
  const { booking, customer, showtime, selectedSeats, selectedSnacks } = req.body;

  if (!booking || !customer || !showtime) {
    return res.status(400).json({ error: 'Missing required booking data.' });
  }

  console.log('--- Sending Email Receipt ---');
  console.log('To:', customer.email);
  console.log('Subject: Your CineMax Booking Confirmation (ID: ' + booking.id + ')');
  console.log('Body:', 'Email content would be generated here using the provided data.');
  console.log('-----------------------------');

  res.status(200).json({ success: true, message: 'Email receipt sent (logged to console).' });
});

