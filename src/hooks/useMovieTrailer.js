// src/hooks/useMovieTrailer.js

import { useEffect, useCallback } from 'react'; // Import useCallback
import { useDispatch, useSelector } from 'react-redux';
import { addTrailerVideo} from '../utils/moviesSlice'; // VERIFY THIS PATH IF STILL GETTING MODULE NOT FOUND
import { API_OPTIONS } from '../utils/constants';

// Get the V3 API Key from environment variables
// For Create React App:
const TMDB_V3_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
// For Vite (if you're using Vite):
// const TMDB_V3_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const useMovieTrailer = (movieId) => {
    const dispatch = useDispatch();
    const trailerVideo = useSelector((store) => store.movies.trailerVideo);

    // Wrap getMovieVideos in useCallback
    const getMovieVideos = useCallback(async () => {
        // Add a check to ensure the v3 API Key is available
        if (!TMDB_V3_API_KEY) {
            console.error("V3 TMDB API Key is missing for Movie Trailer. Please check your .env file.");
            dispatch(addTrailerVideo(null));
            return;
        }

        // Add a check for movieId to prevent malformed URLs
        if (!movieId) {
            console.warn("Movie ID is missing for trailer fetch. Skipping.");
            dispatch(addTrailerVideo(null));
            return;
        }

        try {
            // CONSTRUCT THE URL WITH THE V3 API KEY HERE
            // Ensure `api_key=${TMDB_V3_API_KEY}` is appended correctly
            const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US&api_key=${TMDB_V3_API_KEY}`;

            console.log("Fetching movie trailer from:", url); // Log the exact URL being used

            const data = await fetch(url, API_OPTIONS);

            if (!data.ok) {
                const errorDetails = await data.text();
                console.error(`TMDB API Error (Trailer): ${data.status} ${data.statusText}. Details: ${errorDetails}`);
                dispatch(addTrailerVideo(null));
                return;
            }

            const json = await data.json();
            console.log("Raw video results:", json.results);

            const videoTypes = ['Trailer', 'Teaser', 'Clip', 'Featurette'];
            let selectedVideo = null;

            for (const type of videoTypes) {
                const videos = json.results.filter(
                    (video) => video.type === type && video.site === 'YouTube'
                );
                if (videos.length > 0) {
                    selectedVideo = videos[0];
                    break;
                }
            }

            if (!selectedVideo && json.results && json.results.length > 0) {
                selectedVideo = json.results.find(video => video.site === 'YouTube') || json.results[0];
            }

            console.log('Movie trailer fetched successfully:', selectedVideo?.name || 'No trailer found');
            dispatch(addTrailerVideo(selectedVideo));
        } catch (error) {
            console.error("Error fetching movie trailer:", error);
            dispatch(addTrailerVideo(null));
        }
    }, [movieId, dispatch]); // Dependencies for useCallback: movieId and dispatch

    useEffect(() => {
        if (movieId) {
            dispatch(addTrailerVideo(null));
            getMovieVideos();
        }
    }, [movieId, dispatch, getMovieVideos]);

    return trailerVideo;
};

export default useMovieTrailer;