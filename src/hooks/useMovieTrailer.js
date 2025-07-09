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
        dispatch(addTrailerVideo(null));
        return;
      }

      const url = buildTMDBUrl(`/movie/${movieId}/videos?language=en-US`);
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        const errorText = await data.text();
        console.error(`TMDB API Error: ${data.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${data.status}`);
      }

      const json = await data.json();
      
      // Priority order: Trailer > Teaser > Clip > Featurette
      const videoTypes = ['Trailer', 'Teaser', 'Clip', 'Featurette'];
      let selectedVideo = null;
      
      for (const type of videoTypes) {
        const videos = json.results.filter((video) => video.type === type && video.site === 'YouTube');
        if (videos.length > 0) {
          selectedVideo = videos[0];
          break;
        }
      }
      
      // If no specific type found, get the first YouTube video
      if (!selectedVideo && json.results.length > 0) {
        selectedVideo = json.results.find(video => video.site === 'YouTube') || json.results[0];
      }
      
      dispatch(addTrailerVideo(selectedVideo));
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
      // Dispatch null to prevent infinite loading
      dispatch(addTrailerVideo(null));
    }
  };

  useEffect(() => {
    // Always fetch trailer for new movie, clear previous trailer first
    if (movieId) {
      dispatch(addTrailerVideo(null)); // Clear previous trailer
      getMovieVideos();
    }
  }, [movieId, dispatch]);
};

export default useMovieTrailer;