// src/hooks/useTopRatedMovies.js

import { useEffect, useCallback } from 'react'; // Added useCallback import
import { useDispatch, useSelector } from 'react-redux';
import { addTopRatedMovies } from '../utils/moviesSlice'; // VERIFY THIS PATH IF STILL GETTING MODULE NOT FOUND
import { API_OPTIONS, buildTMDBUrl } from '../utils/constants';

const useTopRatedMovies = () => {
    const dispatch = useDispatch();
    const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);

    // Wrap getTopRatedMovies in useCallback
    const getTopRatedMovies = useCallback(async () => {
        try {
            const endpoint = "movie/top_rated";
            const page = 1;

            const url = buildTMDBUrl(`/${endpoint}?page=${page}`);

            console.log("Fetching top rated movies from:", url);

            const data = await fetch(url, API_OPTIONS);

            if (!data.ok) {
                const errorDetails = await data.text();
                console.error(`TMDB API Error (Top Rated): ${data.status} ${data.statusText}. Details: ${errorDetails}`);
                dispatch(addTopRatedMovies([]));
                return;
            }

            const json = await data.json();
            console.log("Top rated movies fetched successfully:", json.results?.length || 0, 'movies');
            dispatch(addTopRatedMovies(json.results));
        } catch (error) {
            console.error("Error fetching top rated movies:", error);
            dispatch(addTopRatedMovies([]));
        }
    }, [dispatch]); // Dependencies for useCallback: dispatch (as movieId is not used here)

    useEffect(() => {
        if (!topRatedMovies || topRatedMovies.length === 0) {
            getTopRatedMovies();
        }
    }, [topRatedMovies, dispatch, getTopRatedMovies]);

    return getTopRatedMovies;
};

export default useTopRatedMovies;