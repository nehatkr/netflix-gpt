import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, checkTMDBKey } from "../utils/constants";
import { addPolularMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const usePopularMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const popularMovies = useSelector(
    (store) => store.movies.popularMovies
  );

  const getPopularMovies = async () => {
    // Check if API key is available
    if (!checkTMDBKey()) {
      console.warn("TMDB API key not available, skipping popular movies fetch");
      dispatch(addPolularMovies([]));
      return;
    }

    try {
      const url = buildTMDBUrl("/movie/popular?page=1");
      console.log('Fetching popular movies from:', url);
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        console.error(`TMDB API Error: ${data.status} ${data.statusText}`);
        dispatch(addPolularMovies([]));
        return;
      }

      const json = await data.json();
      console.log('Popular movies fetched successfully:', json.results?.length || 0, 'movies');
      dispatch(addPolularMovies(json.results));
    } catch (error) {
      console.error("Error fetching popular movies:", error);
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