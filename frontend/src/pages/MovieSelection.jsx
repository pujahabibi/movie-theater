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
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedTrailerMovie, setSelectedTrailerMovie] = useState(null);

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

  const handleTrailerClick = (movie, e) => {
    e.stopPropagation();
    setSelectedTrailerMovie(movie);
    setShowTrailerModal(true);
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
    setSelectedTrailerMovie(null);
  };

  // Rating Stars Component with animated fill effects
  const RatingStars = ({ rating, maxRating = 5 }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < maxRating; i++) {
      const isFilled = i < fullStars;
      const isHalf = i === fullStars && hasHalfStar;
      
      stars.push(
        <div key={i} className="relative inline-block">
          <Star 
            className={`w-4 h-4 transition-all duration-300 ${
              isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
          {isHalf && (
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1 group">
        {stars.map((star, index) => (
          <div 
            key={index} 
            className="transform transition-transform duration-200 group-hover:scale-110"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {star}
          </div>
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    );
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

  // Skeleton Loading Component
  const MovieSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-pulse">
      <div className="aspect-[2/3] bg-white/10 rounded-xl mb-4"></div>
      <div className="space-y-3">
        <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-white/10 rounded-full w-16"></div>
          <div className="h-6 bg-white/10 rounded-full w-12"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-2/3"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="fade-in">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            🎬 Choose Your Movie Experience
          </h2>
          <p className="text-blue-200 text-lg">Loading our premium collection of blockbuster movies...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(6)].map((_, index) => (
            <MovieSkeleton key={index} />
          ))}
        </div>
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

      {/* Movies Grid - Enhanced Design with 3D Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieSelect(movie)}
            className={`
              group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl 
              transform transition-all duration-500 cursor-pointer perspective-1000
              hover:scale-105 hover:rotate-y-5 hover:shadow-3xl
              ${selectedMovie?.id === movie.id 
                ? 'ring-4 ring-yellow-400 scale-105 shadow-yellow-400/50 animate-pulse-glow' 
                : 'hover:shadow-purple-500/30'
              }
            `}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Enhanced Movie Poster with 3D Transform and Glow */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              
              <img
                src={movie.posterUrl || `https://via.placeholder.com/400x600/667eea/FFFFFF?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              
              {/* Glow effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Rating Badge with enhanced styling */}
              <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-white text-sm font-bold backdrop-blur-sm border border-white/20 z-20 ${getRatingColor(movie.rating)}`}>
                {movie.rating}
              </div>
              
              {/* Price Badge with glassmorphism */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-20">
                <span className="text-yellow-400 font-bold text-lg">${movie.price}</span>
              </div>
              
              {/* Trailer Button */}
              <button
                onClick={(e) => handleTrailerClick(movie, e)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-white/20 backdrop-blur-md rounded-full p-4 text-white opacity-0 
                         group-hover:opacity-100 transition-all duration-300 hover:scale-110 
                         hover:bg-white/30 z-20"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </div>
            
            {/* Enhanced Movie Details */}
            <div className="p-6 bg-white/5 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-yellow-300 transition-colors duration-300">
                {movie.title}
              </h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                {movie.description}
              </p>
              
              {/* Enhanced Movie Info with Rating Stars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {movie.duration} min
                  </span>
                  <span className="flex items-center">
                    <Film className="w-4 h-4 mr-1" />
                    {movie.genre}
                  </span>
                </div>
              </div>
              
              {/* Rating Stars with Animation */}
              <div className="mb-4">
                <RatingStars rating={parseFloat(movie.imdbRating) || 4.5} />
              </div>
              
              {/* Enhanced Genre Tag and Selection Status */}
              <div className="flex justify-between items-center">
                <span className="inline-block px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-white/20 backdrop-blur-sm">
                  {movie.genre}
                </span>
                {selectedMovie?.id === movie.id && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-semibold text-sm">Selected</span>
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-8 bg-white/10 rounded-lg w-20"></div>
                      <div className="h-4 bg-white/10 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : showtimes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <Calendar className="w-20 h-20 mx-auto mb-6 text-white/40" />
                <p className="text-white/70 text-xl mb-2">No showtimes available</p>
                <p className="text-white/50 text-sm">Please check back later or select a different movie</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showtimes.map((showtime, index) => (
                <div
                  key={showtime.id}
                  onClick={() => handleShowtimeSelect(showtime)}
                  className={`
                    group relative overflow-hidden cursor-pointer transition-all duration-500 transform
                    bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10
                    hover:scale-105 hover:shadow-2xl hover:border-white/30
                    ${selectedShowtime?.id === showtime.id
                      ? 'ring-4 ring-yellow-400 scale-105 shadow-yellow-400/50 bg-gradient-to-br from-yellow-400/20 to-orange-500/20'
                      : 'hover:bg-white/10'
                    }
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Pill-style button design */}
                  <div className="p-6 relative z-10">
                    {/* Time and Date Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className={`font-bold text-3xl transition-colors duration-300 ${
                          selectedShowtime?.id === showtime.id ? 'text-yellow-300' : 'text-white'
                        }`}>
                          {formatTime(showtime.startTime)}
                        </span>
                        <span className={`text-sm transition-colors duration-300 ${
                          selectedShowtime?.id === showtime.id ? 'text-yellow-200/80' : 'text-white/60'
                        }`}>
                          {formatDate(showtime.startTime)}
                        </span>
                      </div>
                      
                      {/* Status indicator */}
                      <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        selectedShowtime?.id === showtime.id 
                          ? 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50' 
                          : 'bg-white/20 group-hover:bg-white/40'
                      }`}></div>
                    </div>
                    
                    {/* Theater Info */}
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                        selectedShowtime?.id === showtime.id ? 'bg-yellow-400/20' : 'bg-white/10'
                      }`}>
                        <MapPin className={`w-4 h-4 ${
                          selectedShowtime?.id === showtime.id ? 'text-yellow-300' : 'text-white/70'
                        }`} />
                      </div>
                      <span className={`font-semibold transition-colors duration-300 ${
                        selectedShowtime?.id === showtime.id ? 'text-white' : 'text-white/80'
                      }`}>
                        {showtime.theaterRoom}
                      </span>
                    </div>
                    
                    {/* Seats Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 transition-colors duration-300 ${
                          selectedShowtime?.id === showtime.id ? 'bg-yellow-400/20' : 'bg-white/10'
                        }`}>
                          <Users className={`w-4 h-4 ${
                            selectedShowtime?.id === showtime.id ? 'text-yellow-300' : 'text-white/70'
                          }`} />
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          selectedShowtime?.id === showtime.id ? 'text-white/90' : 'text-white/60'
                        }`}>
                          {showtime.totalSeats} seats
                        </span>
                      </div>
                      
                      {selectedShowtime?.id === showtime.id && (
                        <div className="flex items-center space-x-2 animate-fade-in">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-300 font-semibold text-sm">Selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  
                  {/* Selection glow effect */}
                  {selectedShowtime?.id === showtime.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-orange-500/20 rounded-2xl animate-pulse"></div>
                  )}
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






