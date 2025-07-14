import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, checkTMDBKey } from "../utils/constants";
import { addUpcomingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useUpcomingMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const upcomingMovies = useSelector(
    (store) => store.movies.upcomingMovies
  );

  const getUpcomingMovies = async () => {
    // Check if TMDB is configured
    if (!checkTMDBKey()) {
      console.error("TMDB access token not configured. Please add REACT_APP_TMDB_ACCESS_TOKEN to your .env file");
      dispatch(addUpcomingMovies([]));
      return;
    }

    try {
      const url = buildTMDBUrl("/movie/upcoming?page=1");
      console.log('Fetching upcoming movies from:', url);
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        console.error(`TMDB API Error: ${data.status} ${data.statusText}`);
        dispatch(addUpcomingMovies([]));
        return;
      }

      const json = await data.json();
      console.log('Upcoming movies fetched successfully:', json.results?.length || 0, 'movies');
      dispatch(addUpcomingMovies(json.results));
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
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