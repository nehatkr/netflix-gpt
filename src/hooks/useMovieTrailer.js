// src/hooks/useMovieTrailer.js

import { useEffect, useCallback } from 'react'; // Import useCallback
import { useDispatch, useSelector } from 'react-redux';
import { addTrailerVideo} from '../utils/moviesSlice'; // VERIFY THIS PATH IF STILL GETTING MODULE NOT FOUND
import { API_OPTIONS, buildTMDBUrl } from '../utils/constants';

const useMovieTrailer = (movieId) => {
    const dispatch = useDispatch();
    const trailerVideo = useSelector((store) => store.movies.trailerVideo);

    // Wrap getMovieVideos in useCallback
    const getMovieVideos = useCallback(async () => {
        // Add a check for movieId to prevent malformed URLs
        if (!movieId) {
            console.warn("Movie ID is missing for trailer fetch. Skipping.");
            dispatch(addTrailerVideo(null));
            return;
        }

        try {
            const url = buildTMDBUrl(`/movie/${movieId}/videos?language=en-US`);

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

            // Enhanced video selection logic
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

            // Add timeout for video loading
            if (selectedVideo) {
                console.log('Movie trailer found:', selectedVideo.name);
                // Add a small delay to ensure proper loading
                setTimeout(() => {
                    dispatch(addTrailerVideo(selectedVideo));
                }, 100);
            } else {
                console.warn('No suitable trailer found for movie:', movieId);
                dispatch(addTrailerVideo(null));
            }
        } catch (error) {
            console.error("Error fetching movie trailer:", error);
            dispatch(addTrailerVideo(null));
        }
    }, [movieId, dispatch]); // Dependencies for useCallback: movieId and dispatch

    useEffect(() => {
        if (movieId) {
            // Clear previous trailer before fetching new one
            dispatch(addTrailerVideo(null));
            // Add small delay to prevent rapid API calls
            const timer = setTimeout(() => {
                getMovieVideos();
            }, 200);
            
            return () => clearTimeout(timer);
        }
    }, [movieId, dispatch, getMovieVideos]);

    return trailerVideo;
};

export default useMovieTrailer;