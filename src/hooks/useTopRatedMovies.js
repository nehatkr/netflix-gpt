import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import { addTopRatedMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useTopRatedMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const topRatedMovies = useSelector(
    (store) => store.movies.topRatedMovies
  );

  const getTopRatedMovies = async () => {
    try {
      // Check if TMDB API key is available
      if (!process.env.REACT_APP_TMDB_KEY || 
          process.env.REACT_APP_TMDB_KEY === 'your_actual_tmdb_api_key_here' ||
          process.env.REACT_APP_TMDB_KEY.includes('example_jwt_token_here')) {
        console.warn("TMDB API key is missing or not configured. Using fallback data.");
        dispatch(addTopRatedMovies([]));
        return;
      }

      const url = buildTMDBUrl("/movie/top_rated?page=1");
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        console.warn(`TMDB API unavailable (${data.status}). Using fallback data.`);
        dispatch(addTopRatedMovies([]));
        return;
      }

      const json = await data.json();
      dispatch(addTopRatedMovies(json.results));
    } catch (error) {
      console.warn("TMDB API unavailable. Using fallback data.");
      dispatch(addTopRatedMovies([]));
    }
  };

  useEffect(() => {
    if (!topRatedMovies) {
      getTopRatedMovies();
    }
  }, []);
};

export default useTopRatedMovies;