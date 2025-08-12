const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create movies
  const movies = [
    {
      title: 'The Amazing Spider-Man',
      description: 'A young Peter Parker discovers his spider powers and becomes the amazing Spider-Man.',
      duration: 136,
      genre: 'Action',
      rating: 'PG-13',
      price: 12.50,
      posterUrl: 'https://via.placeholder.com/300x450/FF6B6B/FFFFFF?text=Spider-Man'
    },
    {
      title: 'Inception',
      description: 'A thief who enters the dreams of others to steal their secrets from their subconscious.',
      duration: 148,
      genre: 'Sci-Fi',
      rating: 'PG-13',
      price: 14.00,
      posterUrl: 'https://via.placeholder.com/300x450/4ECDC4/FFFFFF?text=Inception'
    },
    {
      title: 'The Lion King',
      description: 'A young lion prince flees his kingdom only to learn the true meaning of responsibility.',
      duration: 118,
      genre: 'Animation',
      rating: 'G',
      price: 10.00,
      posterUrl: 'https://via.placeholder.com/300x450/FFE66D/FFFFFF?text=Lion+King'
    }
  ];

  // Clear existing data first
  await prisma.bookingSnack.deleteMany();
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.snack.deleteMany();
  
  // Create movies
  const createdMovies = await prisma.movie.createMany({
    data: movies
  });
  
  // Fetch created movies to use their IDs
  const movieRecords = await prisma.movie.findMany();
  console.log(`Created ${movieRecords.length} movies`);

  // Create showtimes for each movie
  const showtimes = [];
  const rooms = ['Theater 1', 'Theater 2', 'Theater 3'];
  const times = ['10:00', '13:30', '17:00', '20:30'];
  
  for (const movie of movieRecords) {
    for (let i = 0; i < 2; i++) { // 2 showtimes per movie
      const room = rooms[i % rooms.length];
      const time = times[i * 2 % times.length];
      
      const today = new Date();
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + Math.floor(i / 2)); // Today and tomorrow
      
      const [hours, minutes] = time.split(':').map(Number);
      showDate.setHours(hours, minutes, 0, 0);
      
      const showtime = await prisma.showtime.create({
        data: {
          movieId: movie.id,
          startTime: showDate,
          theaterRoom: room,
          totalSeats: 100
        }
      });
      showtimes.push(showtime);
      console.log(`Created showtime: ${movie.title} at ${time} in ${room}`);
    }
  }

  // Create seats for each showtime
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 10;
  
  for (const showtime of showtimes) {
    const seats = [];
    
    for (const row of rows) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatType = (row === 'A' || row === 'B') ? 'premium' : 'regular';
        // Randomly occupy some seats (20% occupancy)
        const isOccupied = Math.random() < 0.2;
        
        seats.push({
          showtimeId: showtime.id,
          seatRow: row,
          seatNumber: seatNum,
          seatType,
          isOccupied
        });
      }
    }
    
    await prisma.seat.createMany({
      data: seats
    });
    console.log(`Created ${seats.length} seats for showtime ${showtime.id}`);
  }

  // Create snacks
  const snacks = [
    {
      name: 'Large Popcorn',
      description: 'Freshly popped buttery popcorn',
      price: 8.50,
      category: 'Snacks',
      imageUrl: 'https://via.placeholder.com/200x150/FF6B6B/FFFFFF?text=Popcorn'
    },
    {
      name: 'Medium Soda',
      description: 'Ice-cold soft drink',
      price: 5.50,
      category: 'Beverages',
      imageUrl: 'https://via.placeholder.com/200x150/4ECDC4/FFFFFF?text=Soda'
    },
    {
      name: 'Nachos with Cheese',
      description: 'Crispy tortilla chips with warm cheese sauce',
      price: 7.50,
      category: 'Snacks',
      imageUrl: 'https://via.placeholder.com/200x150/FFE66D/FFFFFF?text=Nachos'
    },
    {
      name: 'Candy Mix',
      description: 'Assorted movie theater candies',
      price: 4.50,
      category: 'Candy',
      imageUrl: 'https://via.placeholder.com/200x150/A8E6CF/FFFFFF?text=Candy'
    },
    {
      name: 'Hot Dog',
      description: 'Classic beef hot dog with condiments',
      price: 6.50,
      category: 'Food',
      imageUrl: 'https://via.placeholder.com/200x150/FF8B94/FFFFFF?text=Hot+Dog'
    },
    {
      name: 'Ice Cream',
      description: 'Vanilla ice cream cup',
      price: 4.00,
      category: 'Desserts',
      imageUrl: 'https://via.placeholder.com/200x150/B4A7D6/FFFFFF?text=Ice+Cream'
    }
  ];

  await prisma.snack.createMany({
    data: snacks
  });
  
  const createdSnacks = await prisma.snack.findMany();
  console.log(`Created ${createdSnacks.length} snacks`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });