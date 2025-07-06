import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import { addPolularMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const usePopularMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const popularMovies = useSelector(
    (store) => store.movies.popularMovies
  );

  const getPopularMovies = async () => {
    try {
      // Check if TMDB API key is available
      if (!process.env.REACT_APP_TMDB_KEY || process.env.REACT_APP_TMDB_KEY === 'your_actual_tmdb_api_key_here') {
        console.error("TMDB API key is missing or not configured");
        return;
      }

      const url = buildTMDBUrl("/movie/popular?page=1");
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const json = await data.json();
      dispatch(addPolularMovies(json.results));
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      // Dispatch empty array to prevent infinite loading
      dispatch(addPolularMovies([]));
    }
  };

  useEffect(() => {
    if (!popularMovies) {
      getPopularMovies();
    }
  }, []);
};

export default usePopularMovies;