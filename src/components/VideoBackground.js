import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  useMovieTrailer(movieId);
  
  return (
    <div className="w-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 z-10"></div>
      <iframe
        className="w-screen aspect-video scale-125 sm:scale-110 md:scale-100"
        src={"https://www.youtube.com/embed/" + trailerVideo?.key + "?&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=" + trailerVideo?.key}
        title="Movie Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};
export default VideoBackground;