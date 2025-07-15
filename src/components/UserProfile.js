import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import Header from "./Header";

const UserProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Profile Information State
  const [profileData, setProfileData] = useState({
    displayName: user?.displayname || "",
    username: "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    bio: "",
    customUrl: "",
    website: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    facebook: ""
  });

  // Profile Picture State
  const [profilePicture, setProfilePicture] = useState({
    current: user?.photoURL || "",
    preview: null,
    file: null,
    cropping: false
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    profileVisibility: "public",
    showEmail: false,
    showPhone: false
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    language: "en",
    theme: "dark",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    autoplay: true,
    dataUsage: "standard"
  });

  // Validation State
  const [validation, setValidation] = useState({});

  // Load saved data from localStorage
  useEffect(() => {
    if (user?.uid) {
      const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
      const savedPreferences = localStorage.getItem(`userPreferences_${user.uid}`);
      const savedSecurity = localStorage.getItem(`userSecurity_${user.uid}`);

      if (savedProfile) {
        setProfileData(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
      }
      if (savedPreferences) {
        setPreferences(prev => ({ ...prev, ...JSON.parse(savedPreferences) }));
      }
      if (savedSecurity) {
        setSecuritySettings(prev => ({ ...prev, ...JSON.parse(savedSecurity) }));
      }
    }
  }, [user?.uid]);

  // Auto-save functionality
  useEffect(() => {
    if (unsavedChanges && user?.uid) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [profileData, preferences, unsavedChanges]);

  // Input validation
  const validateField = useCallback((field, value) => {
    const validations = {};

    switch (field) {
      case "displayName":
        if (!value.trim()) validations.displayName = "Full name is required";
        else if (value.length < 2) validations.displayName = "Name must be at least 2 characters";
        else if (value.length > 50) validations.displayName = "Name must be less than 50 characters";
        break;

      case "username":
        if (value && !/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
          validations.username = "Username must be 3-20 characters, letters, numbers, and underscores only";
        }
        break;

      case "email":
        if (!value) validations.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          validations.email = "Please enter a valid email address";
        }
        break;

      case "phone":
        if (value && !/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          validations.phone = "Please enter a valid phone number";
        }
        break;

      case "bio":
        if (value.length > 250) validations.bio = "Bio must be less than 250 characters";
        break;

      case "customUrl":
        if (value && !/^[a-zA-Z0-9_-]{3,30}$/.test(value)) {
          validations.customUrl = "URL must be 3-30 characters, letters, numbers, hyphens, and underscores only";
        }
        break;

      case "newPassword":
        if (value && value.length < 8) {
          validations.newPassword = "Password must be at least 8 characters";
        } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          validations.newPassword = "Password must contain uppercase, lowercase, and number";
        }
        break;

      case "confirmPassword":
        if (value !== securitySettings.newPassword) {
          validations.confirmPassword = "Passwords do not match";
        }
        break;
    }

    setValidation(prev => ({ ...prev, ...validations }));
    return Object.keys(validations).length === 0;
  }, [securitySettings.newPassword]);

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setUnsavedChanges(true);
    
    switch (section) {
      case "profile":
        setProfileData(prev => ({ ...prev, [field]: value }));
        break;
      case "security":
        setSecuritySettings(prev => ({ ...prev, [field]: value }));
        break;
      case "preferences":
        setPreferences(prev => ({ ...prev, [field]: value }));
        break;
    }

    validateField(field, value);
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please upload a JPG, JPEG, or PNG image" });
      return;
    }

    if (file.size > maxSize) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture(prev => ({
        ...prev,
        preview: e.target.result,
        file: file,
        cropping: true
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle profile picture save
  const handleProfilePictureSave = async () => {
    if (!profilePicture.file) return;

    setIsLoading(true);
    try {
      // In a real app, you would upload to a storage service
      // For now, we'll use the preview as the profile picture
      await updateProfile(auth.currentUser, {
        photoURL: profilePicture.preview
      });

      dispatch(addUser({
        ...user,
        photoURL: profilePicture.preview
      }));

      setProfilePicture(prev => ({
        ...prev,
        current: prev.preview,
        preview: null,
        file: null,
        cropping: false
      }));

      setMessage({ type: "success", text: "Profile picture updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile picture" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile picture removal
  const handleProfilePictureRemove = async () => {
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        photoURL: ""
      });

      dispatch(addUser({
        ...user,
        photoURL: ""
      }));

      setProfilePicture({
        current: "",
        preview: null,
        file: null,
        cropping: false
      });

      setMessage({ type: "success", text: "Profile picture removed successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove profile picture" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!securitySettings.currentPassword || !securitySettings.newPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields" });
      return;
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        securitySettings.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, securitySettings.newPassword);

      setSecuritySettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      setMessage({ type: "success", text: "Password updated successfully!" });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: "error", text: "Current password is incorrect" });
      } else {
        setMessage({ type: "error", text: "Failed to update password" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    // Validate all fields
    const fields = ['displayName', 'username', 'email', 'phone', 'bio', 'customUrl'];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field, profileData[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setMessage({ type: "error", text: "Please fix validation errors" });
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName
      });

      dispatch(addUser({
        ...user,
        displayname: profileData.displayName,
        email: profileData.email
      }));

      // Save to localStorage
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profileData));

      setUnsavedChanges(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save function
  const handleAutoSave = () => {
    if (user?.uid) {
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(profileData));
      localStorage.setItem(`userPreferences_${user.uid}`, JSON.stringify(preferences));
      setUnsavedChanges(false);
      setMessage({ type: "info", text: "Changes auto-saved" });
      setTimeout(() => setMessage({ type: "", text: "" }), 2000);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const tabs = [
    { id: "profile", label: "Profile Info", icon: "👤" },
    { id: "picture", label: "Profile Picture", icon: "📷" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "privacy", label: "Privacy", icon: "🛡️" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-glow-red mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile Settings
          </h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
          
          {/* Unsaved changes indicator */}
          {unsavedChanges && (
            <div className="mt-4 flex items-center gap-2 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm">You have unsaved changes</span>
            </div>
          )}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border transition-all duration-300 ${
            message.type === "success" ? "bg-green-900/20 border-green-500/30 text-green-300" :
            message.type === "error" ? "bg-red-900/20 border-red-500/30 text-red-300" :
            "bg-blue-900/20 border-blue-500/30 text-blue-300"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {message.type === "success" ? "✅" : message.type === "error" ? "❌" : "ℹ️"}
              </span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 sticky top-28">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                      activeTab === tab.id
                        ? "bg-red-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              
              {/* Profile Information Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6 fade-in">
                  <h2 className="text-2xl font-bold text-glow mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => handleInputChange("profile", "displayName", e.target.value)}
                        className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.displayName ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {validation.displayName && (
                        <p className="text-red-400 text-sm mt-1">{validation.displayName}</p>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => handleInputChange("profile", "username", e.target.value)}
                        className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.username ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                        }`}
                        placeholder="Choose a username"
                      />
                      {validation.username && (
                        <p className="text-red-400 text-sm mt-1">{validation.username}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                        className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.email ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                        }`}
                        placeholder="Enter your email"
                      />
                      {validation.email && (
                        <p className="text-red-400 text-sm mt-1">{validation.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("profile", "phone", e.target.value)}
                        className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          validation.phone ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {validation.phone && (
                        <p className="text-red-400 text-sm mt-1">{validation.phone}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange("profile", "dateOfBirth", e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                      />
                    </div>

                    {/* Custom URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Custom URL
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-white/20 bg-white/5 text-gray-400 text-sm">
                          netflix-gpt.com/
                        </span>
                        <input
                          type="text"
                          value={profileData.customUrl}
                          onChange={(e) => handleInputChange("profile", "customUrl", e.target.value)}
                          className={`flex-1 p-3 bg-white/10 border rounded-r-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            validation.customUrl ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                          }`}
                          placeholder="your-username"
                        />
                      </div>
                      {validation.customUrl && (
                        <p className="text-red-400 text-sm mt-1">{validation.customUrl}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio / About Me
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                      rows={4}
                      maxLength={250}
                      className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        validation.bio ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {validation.bio && (
                        <p className="text-red-400 text-sm">{validation.bio}</p>
                      )}
                      <p className="text-gray-400 text-sm ml-auto">
                        {profileData.bio.length}/250 characters
                      </p>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-glow mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: "website", label: "Website", icon: "🌐", placeholder: "https://yourwebsite.com" },
                        { key: "twitter", label: "Twitter", icon: "🐦", placeholder: "https://twitter.com/username" },
                        { key: "instagram", label: "Instagram", icon: "📷", placeholder: "https://instagram.com/username" },
                        { key: "linkedin", label: "LinkedIn", icon: "💼", placeholder: "https://linkedin.com/in/username" }
                      ].map((social) => (
                        <div key={social.key}>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="mr-2">{social.icon}</span>
                            {social.label}
                          </label>
                          <input
                            type="url"
                            value={profileData[social.key]}
                            onChange={(e) => handleInputChange("profile", social.key, e.target.value)}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                            placeholder={social.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-white/10">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isLoading || Object.keys(validation).some(key => validation[key])}
                      className="btn-netflix px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Picture Tab */}
              {activeTab === "picture" && (
                <div className="space-y-6 fade-in">
                  <h2 className="text-2xl font-bold text-glow mb-6">Profile Picture</h2>
                  
                  <div className="text-center">
                    {/* Current/Preview Picture */}
                    <div className="relative inline-block mb-6">
                      <img
                        src={profilePicture.preview || profilePicture.current || "https://via.placeholder.com/200x200/333/fff?text=No+Image"}
                        alt="Profile"
                        className="w-48 h-48 rounded-full border-4 border-red-500 object-cover mx-auto"
                      />
                      {profilePicture.preview && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                          Preview
                        </div>
                      )}
                    </div>

                    {/* Upload Instructions */}
                    <div className="mb-6 text-gray-300">
                      <p className="mb-2">Supported formats: JPG, PNG, JPEG</p>
                      <p className="text-sm">Maximum file size: 5MB</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureUpload}
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                      />
                      
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload New Picture
                      </button>

                      {profilePicture.preview && (
                        <button
                          onClick={handleProfilePictureSave}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Save Picture
                            </>
                          )}
                        </button>
                      )}

                      {profilePicture.preview && (
                        <button
                          onClick={() => setProfilePicture(prev => ({ ...prev, preview: null, file: null, cropping: false }))}
                          className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      )}

                      {profilePicture.current && !profilePicture.preview && (
                        <button
                          onClick={handleProfilePictureRemove}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                              Removing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove Picture
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6 fade-in">
                  <h2 className="text-2xl font-bold text-glow mb-6">Security Settings</h2>
                  
                  {/* Change Password */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={securitySettings.currentPassword}
                          onChange={(e) => handleInputChange("security", "currentPassword", e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={securitySettings.newPassword}
                          onChange={(e) => handleInputChange("security", "newPassword", e.target.value)}
                          className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            validation.newPassword ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                          }`}
                          placeholder="Enter new password"
                        />
                        {validation.newPassword && (
                          <p className="text-red-400 text-sm mt-1">{validation.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={securitySettings.confirmPassword}
                          onChange={(e) => handleInputChange("security", "confirmPassword", e.target.value)}
                          className={`w-full p-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                            validation.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-white/20 focus:ring-red-500"
                          }`}
                          placeholder="Confirm new password"
                        />
                        {validation.confirmPassword && (
                          <p className="text-red-400 text-sm mt-1">{validation.confirmPassword}</p>
                        )}
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        disabled={isLoading || !securitySettings.currentPassword || !securitySettings.newPassword || validation.newPassword || validation.confirmPassword}
                        className="btn-netflix px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Two-Factor Authentication
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 mb-1">Add an extra layer of security to your account</p>
                        <p className="text-sm text-gray-400">
                          {securitySettings.twoFactorEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={(e) => handleInputChange("security", "twoFactorEnabled", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Login Devices */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Login Devices
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Windows 11 - Chrome</p>
                            <p className="text-sm text-gray-400">Current session • Last active now</p>
                          </div>
                        </div>
                        <span className="text-green-400 text-sm font-medium">Current</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">iPhone 14 - Safari</p>
                            <p className="text-sm text-gray-400">Last active 2 hours ago</p>
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6 fade-in">
                  <h2 className="text-2xl font-bold text-glow mb-6">Preferences</h2>
                  
                  {/* Language & Region */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      Language & Region
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => handleInputChange("preferences", "language", e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="it">Italiano</option>
                          <option value="pt">Português</option>
                          <option value="ru">Русский</option>
                          <option value="ja">日本語</option>
                          <option value="ko">한국어</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Theme
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => handleInputChange("preferences", "theme", e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                        >
                          <option value="dark">Dark Mode</option>
                          <option value="light">Light Mode</option>
                          <option value="auto">Auto (System)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5v3.5" />
                      </svg>
                      Notifications
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                        { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications" },
                        { key: "marketingEmails", label: "Marketing Emails", desc: "Promotional content and offers" }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{setting.label}</p>
                            <p className="text-sm text-gray-400">{setting.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences[setting.key]}
                              onChange={(e) => handleInputChange("preferences", setting.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Playback Settings */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Playback Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Autoplay Trailers</p>
                          <p className="text-sm text-gray-400">Automatically play trailers when browsing</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.autoplay}
                            onChange={(e) => handleInputChange("preferences", "autoplay", e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Data Usage
                        </label>
                        <select
                          value={preferences.dataUsage}
                          onChange={(e) => handleInputChange("preferences", "dataUsage", e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                        >
                          <option value="low">Low (Save Data)</option>
                          <option value="standard">Standard</option>
                          <option value="high">High (Best Quality)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6 fade-in">
                  <h2 className="text-2xl font-bold text-glow mb-6">Privacy Settings</h2>
                  
                  {/* Profile Visibility */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Profile Visibility
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Who can see your profile?
                        </label>
                        <select
                          value={securitySettings.profileVisibility}
                          onChange={(e) => handleInputChange("security", "profileVisibility", e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
                        >
                          <option value="public">Public - Anyone can see</option>
                          <option value="friends">Friends Only</option>
                          <option value="private">Private - Only me</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Email Address</p>
                            <p className="text-sm text-gray-400">Display email on public profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.showEmail}
                              onChange={(e) => handleInputChange("security", "showEmail", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Phone Number</p>
                            <p className="text-sm text-gray-400">Display phone on public profile</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.showPhone}
                              onChange={(e) => handleInputChange("security", "showPhone", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Data Management
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">GDPR Compliance</h4>
                        <p className="text-sm text-gray-300 mb-3">
                          You have the right to access, update, or delete your personal data at any time.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                            Download My Data
                          </button>
                          <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                            Request Data Correction
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                            Delete My Account
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Data Retention</h4>
                        <p className="text-sm text-gray-300 mb-3">
                          Your data is stored securely and retained according to our privacy policy.
                        </p>
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
                          View Privacy Policy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;