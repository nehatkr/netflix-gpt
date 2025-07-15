import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_OPTIONS, buildTMDBUrl, IMG_CDN_URL } from "../utils/constants";
import Header from "./Header";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Check if TMDB API key is available
        // Fetch movie details
        const movieUrl = buildTMDBUrl(`/movie/${movieId}?language=en-US`);
        const movieResponse = await fetch(movieUrl, API_OPTIONS);
        
        if (!movieResponse.ok) {
          const errorText = await movieResponse.text();
          console.error(`TMDB API Error: ${movieResponse.status} - ${errorText}`);
          throw new Error(`HTTP error! status: ${movieResponse.status}`);
        }
        
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch movie videos (trailers, teasers)
        const videosUrl = buildTMDBUrl(`/movie/${movieId}/videos?language=en-US`);
        const videosResponse = await fetch(videosUrl, API_OPTIONS);
        
        if (!videosResponse.ok) {
          console.error(`Error fetching videos: ${videosResponse.status}`);
          setVideos([]);
        } else {
        const videosData = await videosResponse.json();
        setVideos(videosData.results || []);

        // Set default video (trailer or teaser)
        const trailer = videosData.results?.find(video => video.type === "Trailer");
        const teaser = videosData.results?.find(video => video.type === "Teaser");
        setSelectedVideo(trailer || teaser || videosData.results?.[0]);
        }

        // Fetch cast information
        const creditsUrl = buildTMDBUrl(`/movie/${movieId}/credits?language=en-US`);
        const creditsResponse = await fetch(creditsUrl, API_OPTIONS);
        
        if (!creditsResponse.ok) {
          console.error(`Error fetching credits: ${creditsResponse.status}`);
          setCast([]);
        } else {
        const creditsData = await creditsResponse.json();
        setCast(creditsData.cast?.slice(0, 10) || []);
        }

      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const handlePlayTrailer = () => {
    if (selectedVideo) {
      setShowTrailer(true);
    } else {
      alert("No trailer available for this movie.");
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setShowTrailer(true);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center page-transition-enter">
        <Header />
        <div className="text-white text-center relative z-10 pt-20 fade-in">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-4 text-glow slide-in-up" style={{animationDelay: '0.3s'}}>Loading Movie Details</h2>
          <p className="text-gray-300 slide-in-up" style={{animationDelay: '0.5s'}}>Fetching cinematic information...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center page-transition-enter">
        <Header />
        <div className="text-white text-center pt-20 fade-in">
          <h2 className="text-2xl font-bold mb-4 slide-in-down">Movie Not Found</h2>
          <p className="text-gray-300 mb-6 slide-in-up" style={{animationDelay: '0.3s'}}>
            The movie you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button 
            onClick={handleBackClick}
            className="btn-netflix px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 slide-in-up"
            style={{animationDelay: '0.5s'}}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative page-transition-enter">
      <Header />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 fade-in">
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30 zoom"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center text-white hover:text-red-400 transition-all duration-300 group slide-in-left hover:scale-105"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">←</span>
          <span className="font-semibold">Back to Browse</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Movie Poster */}
          <div className="lg:col-span-1 fade-in" style={{animationDelay: '0.2s'}}>
            <div className="relative group">
              <img
                src={movie.poster_path ? `${IMG_CDN_URL}${movie.poster_path}` : '/placeholder-poster.jpg'}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </div>

          {/* Movie Information */}
          <div className="lg:col-span-2 space-y-6 slide-in-right">
            {/* Title and Basic Info */}
            <div className="fade-in" style={{animationDelay: '0.4s'}}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-glow-red slide-in-down">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4 slide-in-up" style={{animationDelay: '0.6s'}}>
                  "{movie.tagline}"
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-6 fade-in-stagger">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-semibold">{movie.vote_average?.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📅</span>
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <span>⏱️</span>
                    <span>{movie.runtime} min</span>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>${(movie.budget / 1000000).toFixed(0)}M</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre, index) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-sm font-medium hover:bg-red-600/30 transition-all duration-300 hover:scale-105 fade-in-stagger"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 fade-in" style={{animationDelay: '0.8s'}}>
              <button
                onClick={handlePlayTrailer}
                className="flex items-center justify-center bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg group"
                disabled={!selectedVideo}
              >
                <span className="mr-2 text-lg group-hover:scale-110 transition-transform duration-300">▶️</span>
                {selectedVideo ? "Play Trailer" : "No Trailer"}
              </button>
              <button className="flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30 shadow-lg group">
                <span className="mr-2 group-hover:scale-110 transition-transform duration-300">+</span>
                My List
              </button>
              <button className="flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30 shadow-lg group">
                <span className="mr-2 group-hover:scale-110 transition-transform duration-300">👍</span>
                Like
              </button>
            </div>

            {/* Overview */}
            <div className="fade-in" style={{animationDelay: '1s'}}>
              <h3 className="text-xl font-bold mb-3 text-glow">Overview</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview || "No overview available for this movie."}
              </p>
            </div>

            {/* Production Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 fade-in" style={{animationDelay: '1.2s'}}>
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-400 mb-2">Production Companies</h4>
                  <div className="space-y-1">
                    {movie.production_companies.slice(0, 3).map((company) => (
                      <p key={company.id} className="text-white">{company.name}</p>
                    ))}
                  </div>
                </div>
              )}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-400 mb-2">Languages</h4>
                  <div className="space-y-1">
                    {movie.spoken_languages.map((lang) => (
                      <p key={lang.iso_639_1} className="text-white">{lang.english_name}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mb-12 fade-in" style={{animationDelay: '1.4s'}}>
            <h3 className="text-2xl font-bold mb-6 text-glow slide-in-left">Cast</h3>
            <div className="flex overflow-x-scroll scrollbar-hide custom-scrollbar pb-4 gap-4">
              {cast.map((actor, index) => (
                <div
                  key={actor.id}
                  className="flex-shrink-0 w-32 text-center group fade-in-stagger"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src={actor.profile_path ? `${IMG_CDN_URL}${actor.profile_path}` : '/placeholder-actor.jpg'}
                      alt={actor.name}
                      className="w-full h-40 object-cover transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-red-400 transition-colors duration-300">
                    {actor.name}
                  </h4>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <div className="mb-12 fade-in" style={{animationDelay: '1.6s'}}>
            <h3 className="text-2xl font-bold mb-6 text-glow slide-in-left">Videos & Trailers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.slice(0, 6).map((video, index) => (
                <div
                  key={video.id}
                  className="relative group cursor-pointer fade-in-stagger transition-all duration-300 hover:scale-105"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-800 aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                      alt={video.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-2xl ml-1">▶</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold text-sm group-hover:text-red-400 transition-colors duration-300">
                      {video.name}
                    </h4>
                    <p className="text-gray-400 text-xs mt-1">{video.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showTrailer && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 fade-in modal-backdrop">
          <div className="relative w-full max-w-6xl aspect-video scale-in">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 text-2xl font-bold transition-all duration-300 z-10 hover:scale-110"
            >
              ✕ Close
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.name}
              className="w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;