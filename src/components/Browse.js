import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import GptSearch from "./GptSearch";
import Header from "./Header";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./Secondaryontainer";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  
  // Fetch all movie data
  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  // Handle smooth transitions between views
  useEffect(() => {
    if (showGptSearch !== (currentView === 'gpt')) {
      setIsTransitioning(true);
      
      // Start transition
      const timer = setTimeout(() => {
        setCurrentView(showGptSearch ? 'gpt' : 'home');
        
        // End transition
        const endTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
        
        return () => clearTimeout(endTimer);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [showGptSearch, currentView]);
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header />
      
      {/* Home View */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        currentView === 'home' && !isTransitioning 
          ? 'opacity-100 translate-x-0 scale-100' 
          : currentView === 'home' && isTransitioning
          ? 'opacity-0 -translate-x-full scale-95'
          : 'opacity-0 translate-x-full scale-95 pointer-events-none'
      }`}>
        <MainContainer />
        <SecondaryContainer />
      </div>
      
      {/* GPT Search View */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        currentView === 'gpt' && !isTransitioning 
          ? 'opacity-100 translate-x-0 scale-100' 
          : currentView === 'gpt' && isTransitioning
          ? 'opacity-0 translate-x-full scale-95'
          : 'opacity-0 -translate-x-full scale-95 pointer-events-none'
      }`}>
        <GptSearch />
      </div>
      
      {/* Transition overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
      )}
    </div>
  );
};

export default Browse;