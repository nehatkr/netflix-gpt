import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO } from "../utils/constants";

const WelcomePage = () => {
  const [showContent, setShowContent] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const navigate = useNavigate();

  const welcomeTexts = [
    "Welcome to Netflix GPT",
    "AI-Powered Movie Discovery",
    "Your Cinematic Journey Begins",
    "Discover. Watch. Enjoy."
  ];

  useEffect(() => {
    // Show content after initial load
    const timer1 = setTimeout(() => setShowContent(true), 500);
    
    // Cycle through welcome texts
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % welcomeTexts.length);
    }, 3000);

    // Auto-navigate to login after 12 seconds
    const autoNavigate = setTimeout(() => {
      handleGetStarted();
    }, 12000);

    return () => {
      clearTimeout(timer1);
      clearInterval(textInterval);
      clearTimeout(autoNavigate);
    };
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden welcome-page">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-blue-900/20"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-500 rounded-full opacity-60 welcome-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Animated Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl welcome-float"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl welcome-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl welcome-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-yellow-500/10 rounded-full blur-3xl welcome-float" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 text-white/70 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-110"
        >
          Skip →
        </button>

        {/* Logo */}
        <div className={`mb-12 transition-all duration-1000 ${showContent ? 'welcome-logo-enter' : 'opacity-0 scale-50'}`}>
          <img 
            src={LOGO} 
            alt="Netflix GPT" 
            className="w-48 sm:w-64 md:w-80 h-auto filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Main Content */}
        <div className={`text-center transition-all duration-1000 delay-500 ${showContent ? 'welcome-content-enter' : 'opacity-0 translate-y-10'}`}>
          {/* Dynamic Welcome Text */}
          <div className="h-20 mb-8 flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white text-glow-red welcome-text-slide">
              {welcomeTexts[currentText]}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed welcome-subtitle">
            Experience the future of entertainment with AI-powered movie recommendations tailored just for you
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="welcome-feature-card">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-400 text-sm">Smart recommendations using advanced AI technology</p>
            </div>
            <div className="welcome-feature-card" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Vast Library</h3>
              <p className="text-gray-400 text-sm">Access to thousands of movies and shows</p>
            </div>
            <div className="welcome-feature-card" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-white mb-2">Personalized</h3>
              <p className="text-gray-400 text-sm">Tailored content based on your preferences</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetStarted}
            className="welcome-cta-button group"
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300">🚀</span>
              Get Started
              <span className="ml-3 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center space-x-2">
            {welcomeTexts.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  index === currentText ? 'bg-red-500 w-8' : 'bg-white/30'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Auto-navigation countdown */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-sm transition-all duration-1000 delay-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full spinner"></div>
            <span>Auto-starting in a moment...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;