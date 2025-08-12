import React, { useState, useEffect } from 'react';
import { Clock, Star, Calendar, Film, Users, MapPin } from 'lucide-react';
import api from '../api';

function MovieSelection({ bookingData, updateBookingData, nextStep }) {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(bookingData.movie);
  const [selectedShowtime, setSelectedShowtime] = useState(bookingData.showtime);
  const [loading, setLoading] = useState(true);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [error, setError] = useState(null);

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
      setError(null);
      const response = await api.get('/movies');
      // API returns {success: true, data: [...]} and interceptor extracts the response
      const moviesData = response.data || response || [];
      console.log('Movies response:', response);
      console.log('Movies data:', moviesData);
      setMovies(Array.isArray(moviesData) ? moviesData : []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimes = async (movieId) => {
    setLoadingShowtimes(true);
    try {
      const response = await api.get(`/showtimes/movie/${movieId}`);
      // API returns {success: true, data: [...]} and interceptor extracts the response
      const showtimesData = response.data || response || [];
      console.log('Showtimes response:', response);
      console.log('Showtimes data:', showtimesData);
      setShowtimes(Array.isArray(showtimesData) ? showtimesData : []);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      setShowtimes([]);
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

  const getGenreColor = (genre) => {
    const colors = {
      'Action': 'bg-red-100 text-red-800',
      'Sci-Fi': 'bg-blue-100 text-blue-800',
      'Animation': 'bg-green-100 text-green-800',
      'Comedy': 'bg-yellow-100 text-yellow-800',
      'Drama': 'bg-purple-100 text-purple-800',
      'Horror': 'bg-gray-100 text-gray-800',
    };
    return colors[genre] || 'bg-blue-100 text-blue-800';
  };

  const getRatingColor = (rating) => {
    const colors = {
      'G': 'bg-green-500',
      'PG': 'bg-blue-500',
      'PG-13': 'bg-yellow-500',
      'R': 'bg-red-500',
      'NC-17': 'bg-gray-500'
    };
    return colors[rating] || 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="spinner mb-4"></div>
        <p className="text-white text-lg">Loading amazing movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-400 text-center">
          <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-4">{error}</p>
          <button 
            onClick={fetchMovies}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          🎬 Choose Your Movie Experience
        </h2>
        <p className="text-blue-200 text-lg">Select from our premium collection of blockbuster movies</p>
      </div>

      {/* Movies Grid - Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieSelect(movie)}
            className={`
              movie-card bg-white rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 cursor-pointer
              ${selectedMovie?.id === movie.id ? 'ring-4 ring-yellow-400 scale-105 shadow-yellow-400/25' : 'hover:shadow-blue-500/25'}
            `}
          >
            {/* Movie Poster */}
            <div className="relative aspect-w-2 aspect-h-3 overflow-hidden">
              <img
                src={movie.posterUrl || `https://via.placeholder.com/400x600/667eea/FFFFFF?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="w-full h-80 object-cover transition-transform duration-300 hover:scale-110"
              />
              {/* Rating Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-bold ${getRatingColor(movie.rating)}`}>
                {movie.rating}
              </div>
              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                <span className="text-yellow-400 font-bold text-lg">${movie.price}</span>
              </div>
            </div>
            
            {/* Movie Details */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-1">{movie.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{movie.description}</p>
              
              {/* Movie Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {movie.duration} min
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {movie.rating}
                  </span>
                </div>
              </div>
              
              {/* Genre Tag */}
              <div className="flex justify-between items-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getGenreColor(movie.genre)}`}>
                  {movie.genre}
                </span>
                {selectedMovie?.id === movie.id && (
                  <span className="text-green-500 font-semibold text-sm">✓ Selected</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Showtimes Section */}
      {selectedMovie && (
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white mb-2">
              🎭 Showtimes for {selectedMovie.title}
            </h3>
            <p className="text-blue-200">Choose your preferred showtime and theater</p>
          </div>
          
          {loadingShowtimes ? (
            <div className="flex flex-col items-center justify-center h-32">
              <div className="spinner mb-4"></div>
              <p className="text-white">Loading showtimes...</p>
            </div>
          ) : showtimes.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-300 text-lg">No showtimes available for this movie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showtimes.map((showtime) => (
                <div
                  key={showtime.id}
                  onClick={() => handleShowtimeSelect(showtime)}
                  className={`
                    p-6 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${selectedShowtime?.id === showtime.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-2xl scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-2xl">{formatTime(showtime.startTime)}</span>
                    <span className="flex items-center text-sm opacity-75">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(showtime.startTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-semibold">{showtime.theaterRoom}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-sm opacity-75">
                      <Users className="w-4 h-4 mr-1" />
                      {showtime.totalSeats} seats
                    </span>
                    {selectedShowtime?.id === showtime.id && (
                      <span className="font-bold">✓ Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Continue Button */}
      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedMovie || !selectedShowtime}
          className={`
            px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 btn transform
            ${selectedMovie && selectedShowtime
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-2xl hover:scale-105 shadow-green-500/25'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {selectedMovie && selectedShowtime 
            ? '🎟️ Continue to Seat Selection' 
            : 'Select Movie & Showtime'
          }
        </button>
        
        {selectedMovie && selectedShowtime && (
          <p className="text-green-300 mt-4 text-sm">
            ✓ {selectedMovie.title} at {formatTime(selectedShowtime.startTime)} in {selectedShowtime.theaterRoom}
          </p>
        )}
      </div>
    </div>
  );
}

export default MovieSelection;
