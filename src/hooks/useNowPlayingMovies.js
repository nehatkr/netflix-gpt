import { useEffect } from 'react'; // Added useEffect import
import { useDispatch, useSelector } from 'react-redux';
import { addNowPlayingMovies } from '../utils/moviesSlice';
import { API_OPTIONS } from '../utils/constants'; // Assuming API_OPTIONS is correctly defined without Authorization header

// Get the V3 API Key from environment variables
// For Create React App:
const TMDB_V3_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
// For Vite (if you're using Vite):
// const TMDB_V3_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const useNowPlayingMovies = () => {
    const dispatch = useDispatch();
    const nowPlayingMovies = useSelector((store) => store.movies.nowPlayingMovies);

    const getNowPlayingMovies = async () => {
        // Check if the v3 API Key is available before making the request
        if (!TMDB_V3_API_KEY) {
            console.error("V3 TMDB API Key is missing for Now Playing Movies. Please check your .env file.");
            dispatch(addNowPlayingMovies([]));
            return;
        }

        try {
            const endpoint = "movie/now_playing";
            const page = 1; // You can make this dynamic if needed

            // CONSTRUCT THE URL WITH THE V3 API KEY HERE (NO PARENTHESES AFTER TMDB_V3_API_KEY)
            const url = `https://api.themoviedb.org/3/${endpoint}?page=${page}&api_key=${TMDB_V3_API_KEY}`;

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
    };

    // Fetch movies when the component mounts, but only if not already fetched
    useEffect(() => {
        // Only fetch if nowPlayingMovies is empty to avoid unnecessary API calls on re-renders
        if (!nowPlayingMovies || nowPlayingMovies.length === 0) {
            getNowPlayingMovies();
        }
    }, [nowPlayingMovies , dispatch]); // Added nowPlayingMovies and dispatch to dependency array

    // This hook doesn't typically return anything if its main purpose is dispatching
    // return null; // Or return a loading state if you manage it here
};

export default useNowPlayingMovies;