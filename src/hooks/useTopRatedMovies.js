import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, isTMDBConfigured } from "../utils/constants";
import { addTopRatedMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useTopRatedMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const topRatedMovies = useSelector(
    (store) => store.movies.topRatedMovies
  );

  const getTopRatedMovies = async () => {
    // Check if TMDB is configured
    if (!isTMDBConfigured()) {
      console.error("TMDB access token not configured. Please add REACT_APP_TMDB_ACCESS_TOKEN to your .env file");
      dispatch(addTopRatedMovies([]));
      return;
    }

    try {
      const url = buildTMDBUrl("/movie/top_rated?page=1");
      console.log('Fetching top rated movies from:', url);
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        console.error(`TMDB API Error: ${data.status} ${data.statusText}`);
        dispatch(addTopRatedMovies([]));
        return;
      }

      const json = await data.json();
      console.log('Top rated movies fetched successfully:', json.results?.length || 0, 'movies');
      dispatch(addTopRatedMovies(json.results));
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
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