import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, buildTMDBUrl, checkTMDBKey, TMDB_ERROR_CODES } from "../utils/constants";
import { addTrailerVideo } from "../utils/moviesSlice";
import { useEffect } from "react";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();

  const getMovieVideos = async () => {
    // Check if TMDB API key is configured
    if (!checkTMDBKey()) {
      console.error("TMDB API key not configured. Please add REACT_APP_TMDB_API_KEY to your .env file");
      console.error("Get your API key from: https://www.themoviedb.org/settings/api");
      dispatch(addTrailerVideo(null));
      return;
    }

    try {
      const url = buildTMDBUrl(`/movie/${movieId}/videos?language=en-US`);
      console.log('Fetching movie trailer from:', url.replace(/api_key=[^&]+/, 'api_key=***'));
      
      const response = await fetch(url, API_OPTIONS);
      const data = await response.json();

      if (!response.ok) {
        // Handle TMDB API specific errors
        const errorCode = data.status_code;
        const errorMessage = data.status_message || `HTTP ${response.status}`;
        
        if (errorCode && TMDB_ERROR_CODES[errorCode]) {
          console.error(`TMDB API Error ${errorCode}: ${TMDB_ERROR_CODES[errorCode]}`);
        } else {
          console.error(`TMDB API Error: ${errorMessage}`);
        }
        
        // Handle specific error cases
        if (errorCode === 7 || errorCode === 24 || errorCode === 26 || errorCode === 28) {
          console.error("Invalid API key. Please check your TMDB API key in the .env file");
        } else if (errorCode === 25) {
          console.error("API key has expired. Please generate a new one from TMDB");
        } else if (errorCode === 23) {
          console.error("Rate limit exceeded. Please wait before making more requests");
        }

        dispatch(addTrailerVideo(null));
        return;
      }
      
      // Priority order: Trailer > Teaser > Clip > Featurette
      const videoTypes = ['Trailer', 'Teaser', 'Clip', 'Featurette'];
      let selectedVideo = null;
      
      for (const type of videoTypes) {
        const videos = data.results?.filter((video) => video.type === type && video.site === 'YouTube') || [];
        if (videos.length > 0) {
          selectedVideo = videos[0];
          break;
        }
      }
      
      // If no specific type found, get the first YouTube video
      if (!selectedVideo && data.results && data.results.length > 0) {
        selectedVideo = data.results.find(video => video.site === 'YouTube') || data.results[0];
      }
      
      dispatch(addTrailerVideo(selectedVideo));
      console.log('Movie trailer fetched successfully:', selectedVideo?.name || 'No trailer found');
    } catch (error) {
      console.error("Network error fetching movie trailer:", error.message);
      dispatch(addTrailerVideo(null));
    }
  };

  useEffect(() => {
    // Always fetch trailer for new movie, clear previous trailer first
    if (movieId) {
      dispatch(addTrailerVideo(null)); // Clear previous trailer
      getMovieVideos();
    }
  }, [movieId, dispatch, getMovieVideos]);
};

export default useMovieTrailer;