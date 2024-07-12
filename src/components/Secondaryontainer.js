import MovieList from "./movieList";
import { useSelector } from "react-redux";

const SecondaryContainer =()=>{
    const movies = useSelector(store => store.movies)
    return(
        movies.nowPlayingMovies && (
    <div className="bg-black"> 
    <div className=" mt-0 md:-mt-52 relative z-20 ml-4 md:pl-12">
        <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
        <MovieList title={"Top Rated"} movies={movies.topRatedMovies} />
        <MovieList title={"Popular"} movies={movies.popularMovies} />
        <MovieList title={"Upcoming movies"} movies={movies.upcomingMovies} />
        <MovieList title={"Horror"} movies={movies.nowPlayingMovies} />
    </div>
        
    </div>
    )
);
};
export default SecondaryContainer;