export const LOGO =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";
export const USER_AVATAR =
  "https://occ-0-4345-3647.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e";

// Correct API_OPTIONS for TMDB API - using api_key parameter instead of Bearer token
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// Helper function to build TMDB URLs with API key
export const buildTMDBUrl = (endpoint) => {
  const apiKey = process.env.REACT_APP_TMDB_KEY;
  const separator = endpoint.includes('?') ? '&' : '?';
  return `https://api.themoviedb.org/3${endpoint}${separator}api_key=${apiKey}`;
};

export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500";
export const BG_URL="https://assets.nflxext.com/ffe/siteui/vlv3/51c1d7f7-3179-4a55-93d9-704722898999/be90e543-c951-40d0-9ef5-e067f3e33d16/IN-en-20240610-popsignuptwoweeks-perspective_alpha_website_large.jpg";

export const SUPPORTED_LANGUAGES = [
  // Major World Languages
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
  {identifier: "wu", name: "Wu Chinese"},
  {identifier: "ms", name: "Bahasa Melayu (Malay)"},
  {identifier: "te", name: "తెలుగు (Telugu)"},
  {identifier: "vi", name: "Tiếng Việt (Vietnamese)"},
  {identifier: "ko", name: "한국어 (Korean)"},
  {identifier: "ta", name: "தமிழ் (Tamil)"},
  {identifier: "it", name: "Italiano (Italian)"},
  {identifier: "tr", name: "Türkçe (Turkish)"},
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
  {identifier: "uz", name: "O'zbek (Uzbek)"},
  {identifier: "sd", name: "سنڌي (Sindhi)"},
  {identifier: "am", name: "አማርኛ (Amharic)"},
  {identifier: "nl", name: "Nederlands (Dutch)"},
  {identifier: "yo", name: "Yorùbá"},
  {identifier: "ne", name: "नेपाली (Nepali)"},
  {identifier: "si", name: "සිංහල (Sinhala)"},
  {identifier: "km", name: "ខ្មែរ (Khmer)"},
  {identifier: "tg", name: "Тоҷикӣ (Tajik)"},
  {identifier: "ak", name: "Akan"},
  {identifier: "zu", name: "isiZulu"},
  {identifier: "mg", name: "Malagasy"},
  {identifier: "cy", name: "Cymraeg (Welsh)"},
  {identifier: "be", name: "Беларуская (Belarusian)"},
  {identifier: "da", name: "Dansk (Danish)"},
  {identifier: "tl", name: "Filipino"},
  {identifier: "fi", name: "Suomi (Finnish)"},
  {identifier: "ka", name: "ქართული (Georgian)"},
  {identifier: "el", name: "Ελληνικά (Greek)"},
  {identifier: "he", name: "עברית (Hebrew)"},
  {identifier: "hu", name: "Magyar (Hungarian)"},
  {identifier: "is", name: "Íslenska (Icelandic)"},
  {identifier: "ga", name: "Gaeilge (Irish)"},
  {identifier: "lv", name: "Latviešu (Latvian)"},
  {identifier: "lt", name: "Lietuvių (Lithuanian)"},
  {identifier: "mk", name: "Македонски (Macedonian)"},
  {identifier: "mt", name: "Malti (Maltese)"},
  {identifier: "no", name: "Norsk (Norwegian)"},
  {identifier: "ro", name: "Română (Romanian)"},
  {identifier: "sr", name: "Српски (Serbian)"},
  {identifier: "sk", name: "Slovenčina (Slovak)"},
  {identifier: "sl", name: "Slovenščina (Slovenian)"},
  {identifier: "sv", name: "Svenska (Swedish)"},
  {identifier: "cs", name: "Čeština (Czech)"},
  {identifier: "bg", name: "Български (Bulgarian)"},
  {identifier: "hr", name: "Hrvatski (Croatian)"},
  {identifier: "et", name: "Eesti (Estonian)"},
  {identifier: "eu", name: "Euskera (Basque)"},
  {identifier: "gl", name: "Galego (Galician)"},
  {identifier: "ca", name: "Català (Catalan)"},
  {identifier: "lb", name: "Lëtzebuergesch (Luxembourgish)"},
  {identifier: "sq", name: "Shqip (Albanian)"},
  {identifier: "az", name: "Azərbaycan (Azerbaijani)"},
  {identifier: "hy", name: "Հայերեն (Armenian)"},
  {identifier: "kk", name: "Қазақ (Kazakh)"},
  {identifier: "ky", name: "Кыргыз (Kyrgyz)"},
  {identifier: "mn", name: "Монгол (Mongolian)"},
  {identifier: "ps", name: "پښتو (Pashto)"},
  {identifier: "sw", name: "Kiswahili (Swahili)"},
  {identifier: "ha", name: "Hausa"},
  {identifier: "ig", name: "Igbo"},
  {identifier: "af", name: "Afrikaans"},
  {identifier: "xh", name: "isiXhosa"},
  {identifier: "st", name: "Sesotho"},
  {identifier: "tn", name: "Setswana"},
  {identifier: "ve", name: "Tshivenḓa"},
  {identifier: "ts", name: "Xitsonga"},
  {identifier: "ss", name: "siSwati"},
  {identifier: "nr", name: "isiNdebele"}
];

export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;