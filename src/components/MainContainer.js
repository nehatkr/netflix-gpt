import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContainer = () => {
  const movies = useSelector(store => store.movies?.nowPlayingMovies);
  if (!movies) return; // don't render anything when there is no movie (this is also known as early return)

  const mainMovies = movies[0];
  const { original_title, overview, id } = mainMovies;

  return (
    <div className="pt-[30%] sm:pt-[25%] md:pt-0 bg-black relative">
      <VideoTitle title={original_title} overview={overview} />
      <VideoBackground movieId={id} />
    </div>
  );
};
export default MainContainer;