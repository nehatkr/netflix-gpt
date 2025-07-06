import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  useMovieTrailer(movieId);
  
  // Show placeholder while trailer is loading
  if (!trailerVideo) {
    return (
      <div className="w-screen aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full spinner mx-auto mb-4"></div>
          <p className="text-lg">Loading trailer...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 z-10"></div>
      <iframe
        className="w-screen aspect-video scale-125 sm:scale-110 md:scale-100"
        src={`https://www.youtube.com/embed/${trailerVideo?.key}?&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${trailerVideo?.key}`}
        title="Movie Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};
export default VideoBackground;