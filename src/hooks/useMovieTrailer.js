import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl } from "../utils/constants";
import { addTrailerVideo } from "../utils/moviesSlice";
import { useEffect } from "react";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  const getMovieVideos = async () => {
    try {
      // Check if TMDB API key is available
      if (!process.env.REACT_APP_TMDB_KEY || process.env.REACT_APP_TMDB_KEY === 'your_actual_tmdb_api_key_here') {
        console.error("TMDB API key is missing or not configured");
        return;
      }

      const url = buildTMDBUrl(`/movie/${movieId}/videos?language=en-US`);
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const json = await data.json();
      const filterData = json.results.filter((video) => video.type === "Trailer");
      const trailer = filterData.length ? filterData[0] : json.results[0];
      dispatch(addTrailerVideo(trailer));
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
      // Dispatch null to prevent infinite loading
      dispatch(addTrailerVideo(null));
    }
  };

  useEffect(() => {
    if (!trailerVideo && movieId) {
      getMovieVideos();
    }
  }, [movieId]);
};

export default useMovieTrailer;