import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import Header from "./Header";
import MoviesList from "./movieList";

const MovieRecommendations = () => {
  const user = useSelector((store) => store.user);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);

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

  useEffect(() => {
    fetchRecommendations();
  }, [selectedGenres]);

  const fetchRecommendations = async () => {
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
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-glow-red mb-2">
            🎯 Personalized Recommendations
          </h1>
          <p className="text-gray-300">
            Discover movies tailored to your taste and preferences
          </p>
        </div>

        {/* Genre Filter */}
        <div className="mb-8 fade-in" style={{animationDelay: '0.2s'}}>
          <h2 className="text-xl font-semibold mb-4 text-glow">Filter by Genres</h2>
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
              className="mt-3 text-red-400 hover:text-red-300 text-sm transition-colors"
            >
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
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-2xl font-bold mb-4 text-glow">No Recommendations Available</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              We're having trouble loading recommendations right now. Please try again later.
            </p>
            <button
              onClick={fetchRecommendations}
              className="btn-netflix px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRecommendations;