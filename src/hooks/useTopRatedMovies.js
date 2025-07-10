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
      const url = buildTMDBUrl("/movie/top_rated?page=1");
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        const errorText = await data.text();
        console.error(`TMDB API Error: ${data.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const json = await data.json();
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