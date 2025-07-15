// src/hooks/useUpcomingMovies.js

import { useEffect, useCallback } from 'react'; // Added useCallback import
import { useDispatch, useSelector } from 'react-redux';
import { addUpcomingMovies } from '../utils/moviesSlice'; // VERIFY THIS PATH IF STILL GETTING MODULE NOT FOUND
import { API_OPTIONS } from '../utils/constants';

// Get the V3 API Key from environment variables
const TMDB_V3_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
// const TMDB_V3_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // For Vite

const useUpcomingMovies = () => {
    const dispatch = useDispatch();
    const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);

    // Wrap getUpcomingMovies in useCallback
    const getUpcomingMovies = useCallback(async () => {
        if (!TMDB_V3_API_KEY) {
            console.error("V3 TMDB API Key is missing for Upcoming Movies. Please check your .env file.");
            dispatch(addUpcomingMovies([]));
            return;
        }

        try {
            const endpoint = "movie/upcoming";
            const page = 1;

            // CONSTRUCT THE URL WITH THE V3 API KEY HERE (NO PARENTHESES AFTER TMDB_V3_API_KEY)
            const url = `https://api.themoviedb.org/3/${endpoint}?page=${page}&api_key=${TMDB_V3_API_KEY}`;

            console.log("Fetching upcoming movies from:", url);

            const data = await fetch(url, API_OPTIONS);

            if (!data.ok) {
                const errorDetails = await data.text();
                console.error(`TMDB API Error (Upcoming): ${data.status} ${data.statusText}. Details: ${errorDetails}`);
                dispatch(addUpcomingMovies([]));
                return;
            }

            const json = await data.json();
            console.log("Upcoming movies fetched successfully:", json.results?.length || 0, 'movies');
            dispatch(addUpcomingMovies(json.results));
        } catch (error) {
            console.error("Error fetching upcoming movies:", error);
            dispatch(addUpcomingMovies([]));
        }
    }, [dispatch]); // Dependencies for useCallback: dispatch (as movieId is not used here)

    useEffect(() => {
        if (!upcomingMovies || upcomingMovies.length === 0) {
            getUpcomingMovies();
        }
    }, [upcomingMovies, dispatch, getUpcomingMovies]);

    return getUpcomingMovies;
};

export default useUpcomingMovies;