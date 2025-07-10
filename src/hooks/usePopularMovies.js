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
      const url = buildTMDBUrl("/movie/popular?page=1");
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        const errorText = await data.text();
        console.error(`TMDB API Error: ${data.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const json = await data.json();
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