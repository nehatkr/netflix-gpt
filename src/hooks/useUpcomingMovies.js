// src/hooks/useUpcomingMovies.js

import { useEffect, useCallback } from 'react'; // Added useCallback import
import { useDispatch, useSelector } from 'react-redux';
import { addUpcomingMovies } from '../utils/moviesSlice'; // VERIFY THIS PATH IF STILL GETTING MODULE NOT FOUND
import { API_OPTIONS, buildTMDBUrl } from '../utils/constants';

const useUpcomingMovies = () => {
    const dispatch = useDispatch();
    const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);

    // Wrap getUpcomingMovies in useCallback
    const getUpcomingMovies = useCallback(async () => {
        try {
            const endpoint = "movie/upcoming";
            const page = 1;

            const url = buildTMDBUrl(`/${endpoint}?page=${page}`);

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