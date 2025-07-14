import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, checkTMDBKey } from "../utils/constants";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

  const getNowPlayingMovies = async () => {
    // Check if TMDB is configured
    if (!checkTMDBKey()) {
      console.error("TMDB access token not configured. Please add REACT_APP_TMDB_ACCESS_TOKEN to your .env file");
      dispatch(addNowPlayingMovies([]));
      return;
    }

    try {
      const url = buildTMDBUrl("/movie/now_playing?page=1");
      console.log('Fetching now playing movies from:', url);
      const data = await fetch(url, API_OPTIONS);
      
      if (!data.ok) {
        console.error(`TMDB API Error: ${data.status} ${data.statusText}`);
        dispatch(addNowPlayingMovies([]));
        return;
      }
      
      const json = await data.json();
      console.log('Now playing movies fetched successfully:', json.results?.length || 0, 'movies');
      dispatch(addNowPlayingMovies(json.results));
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
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