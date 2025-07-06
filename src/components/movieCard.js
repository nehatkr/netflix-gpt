import { IMG_CDN_URL } from "../utils/constants";

const MovieCard = ({ posterPath }) => {
  if (!posterPath) return null;
  
  return (
    <div className="w-28 sm:w-32 md:w-36 lg:w-48 flex-shrink-0 transform hover:scale-105 transition-transform duration-200 cursor-pointer">
      <img 
        className="w-full h-auto rounded-md shadow-lg" 
        alt="Movie Card" 
        src={IMG_CDN_URL + posterPath} 
      />
    </div>
  );
};
export default MovieCard;