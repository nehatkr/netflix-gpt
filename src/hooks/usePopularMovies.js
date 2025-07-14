import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, checkTMDBKey, TMDB_ERROR_CODES } from "../utils/constants";
import { addPolularMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const usePopularMovies = () => {
  const dispatch = useDispatch();
  const popularMovies = useSelector((store) => store.movies.popularMovies);

  const getPopularMovies = async () => {
    // Check if TMDB API key is configured
    if (!checkTMDBKey()) {
      console.error("TMDB API key not configured. Please add REACT_APP_TMDB_API_KEY to your .env file");
      console.error("Get your API key from: https://www.themoviedb.org/settings/api");
      dispatch(addPolularMovies([]));
      return;
    }

    try {
      const url = buildTMDBUrl("/movie/popular?page=1");
      console.log('Fetching popular movies from:', url.replace(/api_key=[^&]+/, 'api_key=***'));
      
      const response = await fetch(url, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) {
        // Handle TMDB API specific errors
        const errorCode = data.status_code;
        const errorMessage = data.status_message || `HTTP ${response.status}`;
        
        if (errorCode && TMDB_ERROR_CODES[errorCode]) {
          console.error(`TMDB API Error ${errorCode}: ${TMDB_ERROR_CODES[errorCode]}`);
        } else {
          console.error(`TMDB API Error: ${errorMessage}`);
        }
        
        // Handle specific error cases
        if (errorCode === 7 || errorCode === 24 || errorCode === 26 || errorCode === 28) {
          console.error("Invalid API key. Please check your TMDB API key in the .env file");
        } else if (errorCode === 25) {
          console.error("API key has expired. Please generate a new one from TMDB");
        } else if (errorCode === 23) {
          console.error("Rate limit exceeded. Please wait before making more requests");
        }

        dispatch(addPolularMovies([]));
        return;
      }

      console.log('Popular movies fetched successfully:', data.results?.length || 0, 'movies');
      dispatch(addPolularMovies(data.results || []));
    } catch (error) {
      console.error("Network error fetching popular movies:", error.message);
      dispatch(addPolularMovies([]));
    }
  };

  useEffect(() => {
    if (!popularMovies) {
      getPopularMovies();
    }
  }, [getPopularMovies, popularMovies]);
};

export default usePopularMovies;