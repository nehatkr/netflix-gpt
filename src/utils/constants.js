export const LOGO =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";
export const USER_AVATAR =
  "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e";

// TMDB API configuration using API Key authentication (v3)
export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Basic API options without Authorization header (API key will be in URL)
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// Function to check if TMDB API key is configured
export const checkTMDBKey = () => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  return apiKey && apiKey !== 'YOUR_ACTUAL_TMDB_API_KEY_HERE' && apiKey.trim() !== '';
};

// Helper function to build TMDB URLs with API key parameter
export const buildTMDBUrl = (endpoint) => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey || apiKey === 'YOUR_ACTUAL_TMDB_API_KEY_HERE') {
    throw new Error('TMDB API key not configured');
  }
  
  const baseUrl = `https://api.themoviedb.org/3${endpoint}`;
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}api_key=${apiKey}`;
};

export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500";
export const BG_URL="https://assets.nflxext.com/ffe/siteui/vlv3/51c1d7f7-3179-4a55-93d9-704722898999/be90e543-c951-40d0-9ef5-e067f3e33d16/IN-en-20240610-popsignuptwoweeks-perspective_alpha_website_large.jpg";

export const SUPPORTED_LANGUAGES = [
  // Major World Languages (Top 20 most spoken)
  {identifier: "en", name: "English"},
  {identifier: "zh", name: "中文 (Chinese)"},
  {identifier: "hi", name: "हिन्दी (Hindi)"},
  {identifier: "es", name: "Español (Spanish)"},
  {identifier: "fr", name: "Français (French)"},
  {identifier: "ar", name: "العربية (Arabic)"},
  {identifier: "bn", name: "বাংলা (Bengali)"},
  {identifier: "pt", name: "Português (Portuguese)"},
  {identifier: "ru", name: "Русский (Russian)"},
  {identifier: "ja", name: "日本語 (Japanese)"},
  {identifier: "pa", name: "ਪੰਜਾਬੀ (Punjabi)"},
  {identifier: "de", name: "Deutsch (German)"},
  {identifier: "jv", name: "Javanese"},
  {identifier: "ms", name: "Bahasa Melayu (Malay)"},
  {identifier: "te", name: "తెలుగు (Telugu)"},
  {identifier: "vi", name: "Tiếng Việt (Vietnamese)"},
  {identifier: "ko", name: "한국어 (Korean)"},
  {identifier: "ta", name: "தமிழ் (Tamil)"},
  {identifier: "it", name: "Italiano (Italian)"},
  {identifier: "tr", name: "Türkçe (Turkish)"},
  
  // Additional Popular Languages
  {identifier: "ur", name: "اردو (Urdu)"},
  {identifier: "gu", name: "ગુજરાતી (Gujarati)"},
  {identifier: "pl", name: "Polski (Polish)"},
  {identifier: "uk", name: "Українська (Ukrainian)"},
  {identifier: "fa", name: "فارسی (Persian)"},
  {identifier: "ml", name: "മലയാളം (Malayalam)"},
  {identifier: "kn", name: "ಕನ್ನಡ (Kannada)"},
  {identifier: "or", name: "ଓଡ଼ିଆ (Odia)"},
  {identifier: "my", name: "မြန်မာ (Burmese)"},
  {identifier: "th", name: "ไทย (Thai)"},
  
  // European Languages
  {identifier: "nl", name: "Nederlands (Dutch)"},
  {identifier: "sv", name: "Svenska (Swedish)"},
  {identifier: "da", name: "Dansk (Danish)"},
  {identifier: "no", name: "Norsk (Norwegian)"},
  {identifier: "fi", name: "Suomi (Finnish)"},
  {identifier: "el", name: "Ελληνικά (Greek)"},
  {identifier: "he", name: "עברית (Hebrew)"},
  {identifier: "hu", name: "Magyar (Hungarian)"},
  {identifier: "cs", name: "Čeština (Czech)"},
  {identifier: "sk", name: "Slovenčina (Slovak)"},
  {identifier: "bg", name: "Български (Bulgarian)"},
  {identifier: "hr", name: "Hrvatski (Croatian)"},
  {identifier: "sr", name: "Српски (Serbian)"},
  {identifier: "ro", name: "Română (Romanian)"},
  {identifier: "sl", name: "Slovenščina (Slovenian)"},
  {identifier: "et", name: "Eesti (Estonian)"},
  {identifier: "lv", name: "Latviešu (Latvian)"},
  {identifier: "lt", name: "Lietuvių (Lithuanian)"},
  
  // Other Languages
  {identifier: "id", name: "Bahasa Indonesia"},
  {identifier: "tl", name: "Filipino"},
  {identifier: "sw", name: "Kiswahili (Swahili)"},
  {identifier: "am", name: "አማርኛ (Amharic)"},
  {identifier: "yo", name: "Yorùbá"},
  {identifier: "zu", name: "isiZulu"},
  {identifier: "af", name: "Afrikaans"},
  {identifier: "sq", name: "Shqip (Albanian)"},
  {identifier: "az", name: "Azərbaycan (Azerbaijani)"},
  {identifier: "be", name: "Беларуская (Belarusian)"},
  {identifier: "bs", name: "Bosanski (Bosnian)"},
  {identifier: "eu", name: "Euskera (Basque)"},
  {identifier: "gl", name: "Galego (Galician)"},
  {identifier: "ca", name: "Català (Catalan)"},
  {identifier: "cy", name: "Cymraeg (Welsh)"},
  {identifier: "ga", name: "Gaeilge (Irish)"},
  {identifier: "is", name: "Íslenska (Icelandic)"},
  {identifier: "mt", name: "Malti (Maltese)"},
  {identifier: "mk", name: "Македонски (Macedonian)"}
];

export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

// Rate limiting information for TMDB API Key authentication
export const TMDB_RATE_LIMITS = {
  requests_per_second: 40,
  requests_per_day: 1000000,
  note: "TMDB API v3 with API key allows 40 requests per 10 seconds"
};

// Error codes specific to TMDB API Key authentication
export const TMDB_ERROR_CODES = {
  1: "Success",
  2: "Invalid service: this service does not exist",
  3: "Authentication failed: You do not have permissions to access the service",
  4: "Invalid format: This service doesn't exist in that format",
  5: "Invalid parameters: Your request parameters are incorrect",
  6: "Invalid id: The pre-requisite id is invalid or not found",
  7: "Invalid API key: You must be granted a valid key",
  8: "Duplicate entry: The data you tried to submit already exists",
  9: "Service offline: This service is temporarily offline, try again later",
  10: "Suspended API key: Access to your account has been suspended, contact TMDB",
  11: "Internal error: Something went wrong, contact TMDB",
  12: "The item/record was updated successfully",
  13: "The item/record was deleted successfully",
  14: "Authentication failed",
  15: "Failed",
  16: "Device denied",
  17: "Session denied",
  18: "Validation failed",
  19: "Invalid date range: Should be a range no longer than 14 days",
  20: "Invalid page: Pages start at 1 and max at 1000. They are expected to be an integer",
  21: "Invalid date: Format needs to be YYYY-MM-DD",
  22: "Invalid timezone: Please consult the documentation for a valid timezone",
  23: "Your request count (#) is over the allowed limit of (40)",
  24: "Your API key is invalid",
  25: "Provided API key has expired",
  26: "API key not found: Your API key is invalid",
  27: "You must provide an API key to access this resource",
  28: "Invalid API key: Your API key is invalid",
  29: "Your API key has been revoked",
  30: "Invalid username and/or password: You did not provide a valid login",
  31: "Account disabled: Your account is no longer active. Contact TMDB if this is an error",
  32: "Email not verified: Your email address has not been verified",
  33: "Invalid request token: The request token is either expired or invalid",
  34: "The resource you requested could not be found"
};