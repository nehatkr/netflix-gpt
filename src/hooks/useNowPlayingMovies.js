import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

  const getNowPlayingMovies = async () => {
    try {
      const url = buildTMDBUrl("/movie/now_playing?page=1");
      const data = await fetch(url, API_OPTIONS);
      
      if (!data.ok) {
        const errorText = await data.text();
        console.error(`TMDB API Error: ${data.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      
      const json = await data.json();
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