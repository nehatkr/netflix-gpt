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
      const url = buildTMDBUrl("/movie/upcoming?page=1");
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        const errorText = await data.text();
        console.error(`TMDB API Error: ${data.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const json = await data.json();
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