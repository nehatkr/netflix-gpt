import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, isTMDBConfigured } from "../utils/constants";
import { addTrailerVideo } from "../utils/moviesSlice";
import { useEffect } from "react";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  const getMovieVideos = async () => {
    // Check if TMDB is configured
    if (!isTMDBConfigured()) {
      console.error("TMDB access token not configured. Please add REACT_APP_TMDB_ACCESS_TOKEN to your .env file");
      dispatch(addTrailerVideo(null));
      return;
    }

    try {
      const url = buildTMDBUrl(`/movie/${movieId}/videos?language=en-US`);
      console.log('Fetching movie trailer from:', url);
      const data = await fetch(url, API_OPTIONS);

      if (!data.ok) {
        console.error(`TMDB API Error: ${data.status} ${data.statusText}. No trailer available.`);
        dispatch(addTrailerVideo(null));
        return;
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
      console.log('Movie trailer fetched successfully:', selectedVideo?.name || 'No trailer found');
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
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