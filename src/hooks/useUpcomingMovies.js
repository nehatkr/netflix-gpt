import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import { addUpcomingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useUpcomingMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const upcomingMovies = useSelector(
    (store) => store.movies.upcomingMovies
  );

  const getUpcomingMovies = async () => {
    try {
      // Check if TMDB API key is available
      if (!process.env.REACT_APP_TMDB_KEY || 
          process.env.REACT_APP_TMDB_KEY === 'your_actual_tmdb_api_key_here' ||
          process.env.REACT_APP_TMDB_KEY.includes('example_jwt_token_here')) {
        console.warn("TMDB API key is missing or not configured. Using fallback data.");
        dispatch(addUpcomingMovies([]));
        return;
      }

      const url = buildTMDBUrl("/movie/upcoming?page=1");
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        console.warn(`TMDB API unavailable (${data.status}). Using fallback data.`);
        dispatch(addUpcomingMovies([]));
        return;
      }

      const json = await data.json();
      dispatch(addUpcomingMovies(json.results));
    } catch (error) {
      console.warn("TMDB API unavailable. Using fallback data.");
      dispatch(addUpcomingMovies([]));
    }
  };

  useEffect(() => {
    if (!upcomingMovies) {
      getUpcomingMovies();
    }
  }, []);
};

export default useUpcomingMovies;