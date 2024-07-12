import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addPolularMovies } from "../utils/moviesSlice";
import { useEffect } from "react";


const usePopularMovies = ()=>{

    // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const popularMovies = useSelector(
    (store) => store.movies.popularMovies
  );

  const getPopularMovies = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/popular?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addPolularMovies(json.results));
  };

useEffect(()=>{
    if(!popularMovies)getPopularMovies();
},[]);

};

export default usePopularMovies;