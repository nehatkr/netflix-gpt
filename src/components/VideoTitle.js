const VideoTitle = ({ title, overview }) => {
  return (
    <div className="w-screen aspect-video pt-[15%] sm:pt-[12%] md:pt-[20%] px-4 sm:px-6 md:px-12 lg:px-24 absolute text-white bg-gradient-to-r from-black z-10">
      <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight">
        {title}
      </h1>
      <p className="hidden sm:block py-2 md:py-6 text-sm sm:text-base md:text-lg w-full sm:w-3/4 md:w-1/2 leading-relaxed">
        {overview}
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-4 my-4 md:my-6">
        <button className="flex items-center justify-center bg-white text-black py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-semibold rounded-md hover:bg-opacity-80 transition-all duration-200">
          <span className="mr-2">▶️</span>
          Play
        </button>
        <button className="hidden sm:flex items-center justify-center bg-gray-600 text-white py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg bg-opacity-70 rounded-md hover:bg-opacity-90 transition-all duration-200">
          ℹ️ More Info
        </button>
      </div>
    </div>
  );
};
export default VideoTitle;