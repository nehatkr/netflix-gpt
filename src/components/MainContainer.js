import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

const MainContainer = () => {
  const movies = useSelector(store => store.movies?.nowPlayingMovies);
  
  // Show loading state while movies are being fetched
  if (!movies || movies.length === 0) {
    return (
      <div className="pt-[30%] sm:pt-[25%] md:pt-0 bg-black relative min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-4"></div>
          <p className="text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }

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