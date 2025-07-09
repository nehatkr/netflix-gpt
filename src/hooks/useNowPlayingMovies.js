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
      if (!process.env.REACT_APP_TMDB_KEY || 
          process.env.REACT_APP_TMDB_KEY === 'your_actual_tmdb_api_key_here' ||
          process.env.REACT_APP_TMDB_KEY.includes('example_jwt_token_here')) {
        console.warn("TMDB API key is missing or not configured. Using fallback data.");
        dispatch(addNowPlayingMovies([]));
        return;
      }

      const url = buildTMDBUrl("/movie/now_playing?page=1");
      const data = await fetch(url, API_OPTIONS);
      
      if (!data.ok) {
        console.warn(`TMDB API unavailable (${data.status}). Using fallback data.`);
        dispatch(addNowPlayingMovies([]));
        return;
      }
      
      const json = await data.json();
      dispatch(addNowPlayingMovies(json.results));
    } catch (error) {
      console.warn("TMDB API unavailable. Using fallback data.");
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