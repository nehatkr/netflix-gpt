import { useState, useEffect, useCallback } from "react";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import Header from "./Header";
import MoviesList from "./movieList";

const MovieRecommendations = () => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const genresList = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const recommendationCategories = {
        "Trending Now": "/trending/movie/week",
        "Based on Your Preferences": "/discover/movie?sort_by=popularity.desc",
        "Highly Rated": "/movie/top_rated",
        "New Releases": "/movie/now_playing",
      };

      if (selectedGenres.length > 0) {
        recommendationCategories["Your Selected Genres"] = 
          `/discover/movie?with_genres=${selectedGenres.join(',')}&sort_by=popularity.desc`;
      }

      const results = {};
      
      for (const [category, endpoint] of Object.entries(recommendationCategories)) {
        try {
          const url = buildTMDBUrl(endpoint);
          const response = await fetch(url, API_OPTIONS);
          if (response.ok) {
            const data = await response.json();
            results[category] = data.results?.slice(0, 20) || [];
          }
        } catch (error) {
          console.error(`Error fetching ${category}:`, error);
          results[category] = [];
        }
      }

      setRecommendations(results);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenres]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Header />
        <div className="text-white text-center pt-20 fade-in">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-4 text-glow">Curating Recommendations</h2>
          <p className="text-gray-300">Finding the perfect movies for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-24 px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-glow-red mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Personalized Recommendations
          </h1>
          <p className="text-gray-300">
            Discover movies tailored to your taste and preferences
          </p>
        </div>

        {/* Genre Filter */}
        <div className="mb-8 fade-in" style={{animationDelay: '0.2s'}}>
          <h2 className="text-xl font-semibold mb-4 text-glow flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Filter by Genres
          </h2>
          <div className="flex flex-wrap gap-2">
            {genresList.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          {selectedGenres.length > 0 && (
            <button
              onClick={() => setSelectedGenres([])}
              className="mt-3 text-red-400 hover:text-red-300 text-sm transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>

        {/* Recommendations */}
        <div className="space-y-8">
          {Object.entries(recommendations).map(([category, movies], index) => (
            movies.length > 0 && (
              <div key={category} className="fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <MoviesList title={category} movies={movies} />
              </div>
            )
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(recommendations).length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-glow">No Recommendations Available</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We're having trouble loading recommendations right now. Please try again later.
            </p>
            <button
              onClick={fetchRecommendations}
              className="btn-netflix px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRecommendations;