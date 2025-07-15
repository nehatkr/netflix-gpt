import { useEffect, useCallback } from 'react'; // Added useEffect and useCallback imports
import { useDispatch, useSelector } from 'react-redux';
import { addNowPlayingMovies } from '../utils/moviesSlice';
import { API_OPTIONS, buildTMDBUrl } from '../utils/constants';

const useNowPlayingMovies = () => {
    const dispatch = useDispatch();
    const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

    const getNowPlayingMovies = useCallback(async () => {
        try {
            const endpoint = "movie/now_playing";
            const page = 1; // You can make this dynamic if needed

            const url = buildTMDBUrl(`/${endpoint}?page=${page}`);

            console.log("Fetching now playing movies from:", url);

            const data = await fetch(url, API_OPTIONS);

            if (!data.ok) {
                const errorDetails = await data.text(); // Get more details for debugging
                console.error(`TMDB API Error (Now Playing): ${data.status} ${data.statusText}. Details: ${errorDetails}`);
                dispatch(addNowPlayingMovies([]));
                return;
            }

            const json = await data.json();
            console.log("Now playing movies fetched successfully:", json.results?.length || 0, 'movies');
            dispatch(addNowPlayingMovies(json.results));
        } catch (error) {
            console.error("Error fetching now playing movies:", error);
            dispatch(addNowPlayingMovies([]));
        }
    }, [dispatch]); // Dependencies for useCallback

    // Fetch movies when the component mounts, but only if not already fetched
    useEffect(() => {
        // Only fetch if nowPlayingMovies is empty to avoid unnecessary API calls on re-renders
        if (!nowPlayingMovies || nowPlayingMovies.length === 0) {
            getNowPlayingMovies();
        }
    }, [nowPlayingMovies, dispatch, getNowPlayingMovies]); // Added getNowPlayingMovies to dependency array

    // This hook doesn't typically return anything if its main purpose is dispatching
    // return null; // Or return a loading state if you manage it here
};

export default useNowPlayingMovies;