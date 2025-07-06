const VideoTitle = ({ title, overview }) => {
  return (
    <div className="w-screen aspect-video pt-[15%] sm:pt-[12%] md:pt-[20%] px-4 sm:px-6 md:px-12 lg:px-24 absolute text-white z-20">
      <div className="bg-gradient-to-r from-black/90 via-black/60 to-transparent p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-sm">
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight text-glow fade-in">
          {title}
        </h1>
        <p className="hidden sm:block py-2 md:py-6 text-sm sm:text-base md:text-lg w-full sm:w-3/4 md:w-1/2 leading-relaxed text-gray-200 fade-in">
          {overview}
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4 my-4 md:my-6 fade-in">
          <button className="flex items-center justify-center bg-white text-black py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
            <span className="mr-2 text-lg">▶️</span>
            Play
          </button>
          <button className="hidden sm:flex items-center justify-center bg-white/20 backdrop-blur-sm text-white py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 text-sm sm:text-base md:text-lg font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30 shadow-lg">
            <span className="mr-2">ℹ️</span>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};
export default VideoTitle;