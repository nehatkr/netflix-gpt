import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

  const getNowPlayingMovies = async () => {
    try {
      // Check if TMDB API key is available
      if (!process.env.REACT_APP_TMDB_KEY || process.env.REACT_APP_TMDB_KEY === 'your_actual_tmdb_api_key_here') {
        console.error("TMDB API key is missing or not configured");
        return;
      }

      const url = buildTMDBUrl("https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1");
      const data = await fetch(url, API_OPTIONS);
      
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      
      const json = await data.json();
      dispatch(addNowPlayingMovies(json.results));
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      // Dispatch empty array to prevent infinite loading
      dispatch(addNowPlayingMovies([]));
    }
  };

  useEffect(() => {
    if (!nowPlayingMovies) {
      getNowPlayingMovies();
    }
  }, []);
};

export default useNowPlayingMovies;