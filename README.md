# Movie Theater Seating App

A full-stack movie theater application with interactive seat selection, snack ordering, and seamless checkout integration.

## Features

- **Movie Listings**: Browse available movies with showtimes
- **Interactive Seating**: Visual seat map with real-time availability
- **Snack Ordering**: Add snacks to your order with quantity selection
- **Shopping Cart**: Real-time cart updates with totals
- **Checkout**: Complete booking with customer details
- **Booking Management**: View and manage reservations

## Tech Stack

- **Backend**: Node.js 20.19.1, Express 5.1.x, Prisma 6.x, MySQL 8.0
- **Frontend**: React 19.1.1, Vite 7.x, Axios 1.11.0
- **Database**: MySQL 8.0 with Prisma ORM
- **Container**: Docker + Docker Compose v2

## Quick Start

1. **Clone and navigate to project directory**

2. **Start the application**:
   ```bash
   chmod +x run.sh
   ./run.sh
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - API: http://localhost:4000
   - Health Check: http://localhost:4000/api/health

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/movies` - List all movies
- `GET /api/movies/:id/showtimes` - Get movie showtimes
- `GET /api/showtimes/:id/seats` - Get seat layout
- `POST /api/seats/reserve` - Reserve seats temporarily
- `GET /api/snacks` - List all snacks
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details

## Development

**Stop containers**:
```bash
docker compose down
```

**Reset database**:
```bash
docker compose down -v
./run.sh
```

**View logs**:
```bash
docker compose logs -f backend
docker compose logs -f frontend
```