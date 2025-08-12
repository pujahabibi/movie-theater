import React, { useState, useEffect } from 'react';
import { Clock, Star, Calendar } from 'lucide-react';
import api from '../api';

function MovieSelection({ bookingData, updateBookingData, nextStep }) {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(bookingData.movie);
  const [selectedShowtime, setSelectedShowtime] = useState(bookingData.showtime);
  const [loading, setLoading] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      fetchShowtimes(selectedMovie.id);
    }
  }, [selectedMovie]);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies');
      setMovies(response.data || []); // Handle both direct array and {success, data} format
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async (movieId) => {
    setLoadingShowtimes(true);
    try {
      const response = await api.get(`/showtimes/movie/${movieId}`);
      setShowtimes(response.data || []); // Handle both direct array and {success, data} format
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    } finally {
      setLoadingShowtimes(false);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    updateBookingData({ movie, showtime: null });
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    updateBookingData({ showtime });
  };

  const handleContinue = () => {
    if (selectedMovie && selectedShowtime) {
      nextStep();
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Choose Your Movie
      </h2>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieSelect(movie)}
            className={`
              movie-card bg-white rounded-xl overflow-hidden shadow-lg
              ${selectedMovie?.id === movie.id ? 'ring-4 ring-yellow-400' : ''}
            `}
          >
            <div className="aspect-w-2 aspect-h-3">
              <img
                src={movie.posterUrl || `https://via.placeholder.com/300x450/6366f1/FFFFFF?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{movie.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {movie.duration} min
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Star className="w-4 h-4 mr-1" />
                    {movie.rating}
                  </span>
                </div>
                <span className="font-bold text-blue-600">${movie.price}</span>
              </div>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {movie.genre}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Showtimes */}
      {selectedMovie && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Showtimes for {selectedMovie.title}
          </h3>
          
          {loadingShowtimes ? (
            <div className="flex items-center justify-center h-32">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  onClick={() => handleShowtimeSelect(showtime)}
                  className={`
                    p-4 rounded-lg cursor-pointer transition-all duration-200
                    ${selectedShowtime?.id === showtime.id
                      ? 'bg-yellow-500 text-black shadow-lg transform scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{formatTime(showtime.startTime)}</span>
                    <span className="flex items-center text-sm opacity-75">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(showtime.startTime)}
                    </span>
                  </div>
                  <div className="text-sm opacity-75">
                    {showtime.theaterRoom}
                  </div>
                  <div className="text-xs opacity-60 mt-1">
                    {showtime.totalSeats} seats available
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedMovie || !selectedShowtime}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 btn
            ${selectedMovie && selectedShowtime
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          Continue to Seat Selection
        </button>
      </div>
    </div>
  );
}

export default MovieSelection;