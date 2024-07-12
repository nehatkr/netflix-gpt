import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContaine =()=>{
    const movies = useSelector(store=>store.movies?.nowPlayingMovies);
    if(!movies) return;  //dont render any thing when there is no movie(this is also known as early return)

    const mainMovies = movies[0];
    const {original_title,overview,id} = mainMovies;

    return (
    <div className="pt-[30%] bg-black md:pt-0"> 
        <VideoTitle title={original_title} overview={overview}/>
        <VideoBackground movieId={id} />
    </div>
    );
};
export default MainContaine;