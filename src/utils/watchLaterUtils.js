// Watch Later Utility Functions
// Centralized functions for managing watch later functionality

/**
 * Add movie to watch later list
 * @param {Object} movieData - Movie data to add
 * @param {string} userId - User ID
 * @returns {Object} - Result object with success status and message
 */
export const addToWatchLater = (movieData, userId) => {
  try {
    if (!userId) {
      return { success: false, message: 'User not authenticated', type: 'error' };
    }

    const watchLaterKey = `watchLater_${userId}`;
    const existingList = JSON.parse(localStorage.getItem(watchLaterKey)) || [];
    
    // Check for duplicates
    const isDuplicate = existingList.some(item => item.id === movieData.id);
    
    if (isDuplicate) {
      return { success: false, message: 'Movie already in Watch Later', type: 'duplicate' };
    }

    // Add movie to beginning of list
    const updatedList = [movieData, ...existingList];
    
    // Save to localStorage
    localStorage.setItem(watchLaterKey, JSON.stringify(updatedList));
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('watchLaterUpdated', {
      detail: { 
        action: 'add', 
        movie: movieData, 
        totalCount: updatedList.length 
      }
    }));

    return { 
      success: true, 
      message: `"${movieData.title}" added to Watch Later`, 
      type: 'success',
      count: updatedList.length
    };

  } catch (error) {
    console.error('Error adding to watch later:', error);
    return { success: false, message: 'Failed to add movie', type: 'error' };
  }
};

/**
 * Remove movie from watch later list
 * @param {string} movieId - Movie ID to remove
 * @param {string} userId - User ID
 * @returns {Object} - Result object with success status and message
 */
export const removeFromWatchLater = (movieId, userId) => {
  try {
    if (!userId) {
      return { success: false, message: 'User not authenticated', type: 'error' };
    }

    const watchLaterKey = `watchLater_${userId}`;
    const existingList = JSON.parse(localStorage.getItem(watchLaterKey)) || [];
    
    const movieToRemove = existingList.find(item => item.id === movieId);
    const updatedList = existingList.filter(item => item.id !== movieId);
    
    // Save updated list
    localStorage.setItem(watchLaterKey, JSON.stringify(updatedList));
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('watchLaterUpdated', {
      detail: { 
        action: 'remove', 
        movieId, 
        totalCount: updatedList.length 
      }
    }));

    return { 
      success: true, 
      message: movieToRemove ? `"${movieToRemove.title}" removed from Watch Later` : 'Movie removed', 
      type: 'success',
      count: updatedList.length
    };

  } catch (error) {
    console.error('Error removing from watch later:', error);
    return { success: false, message: 'Failed to remove movie', type: 'error' };
  }
};

/**
 * Get watch later list for user
 * @param {string} userId - User ID
 * @returns {Array} - Array of movies in watch later list
 */
export const getWatchLaterList = (userId) => {
  try {
    if (!userId) return [];
    
    const watchLaterKey = `watchLater_${userId}`;
    return JSON.parse(localStorage.getItem(watchLaterKey)) || [];
  } catch (error) {
    console.error('Error getting watch later list:', error);
    return [];
  }
};

/**
 * Check if movie is in watch later list
 * @param {string} movieId - Movie ID to check
 * @param {string} userId - User ID
 * @returns {boolean} - True if movie is in watch later list
 */
export const isInWatchLater = (movieId, userId) => {
  try {
    const watchLaterList = getWatchLaterList(userId);
    return watchLaterList.some(item => item.id === movieId);
  } catch (error) {
    console.error('Error checking watch later status:', error);
    return false;
  }
};

/**
 * Clear entire watch later list
 * @param {string} userId - User ID
 * @returns {Object} - Result object with success status and message
 */
export const clearWatchLater = (userId) => {
  try {
    if (!userId) {
      return { success: false, message: 'User not authenticated', type: 'error' };
    }

    const watchLaterKey = `watchLater_${userId}`;
    localStorage.removeItem(watchLaterKey);
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('watchLaterUpdated', {
      detail: { 
        action: 'clear', 
        totalCount: 0 
      }
    }));

    return { 
      success: true, 
      message: 'Watch Later list cleared', 
      type: 'success',
      count: 0
    };

  } catch (error) {
    console.error('Error clearing watch later:', error);
    return { success: false, message: 'Failed to clear list', type: 'error' };
  }
};

/**
 * Sort watch later list
 * @param {Array} movies - Movies array to sort
 * @param {string} sortBy - Sort criteria ('dateAdded', 'title', 'rating', 'year')
 * @returns {Array} - Sorted movies array
 */
export const sortWatchLaterList = (movies, sortBy) => {
  const moviesCopy = [...movies];
  
  switch (sortBy) {
    case 'title':
      return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
    case 'rating':
      return moviesCopy.sort((a, b) => b.vote_average - a.vote_average);
    case 'year':
      return moviesCopy.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    case 'dateAdded':
    default:
      return moviesCopy.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }
};

/**
 * Export watch later list as JSON
 * @param {string} userId - User ID
 * @returns {string} - JSON string of watch later list
 */
export const exportWatchLaterList = (userId) => {
  try {
    const watchLaterList = getWatchLaterList(userId);
    return JSON.stringify(watchLaterList, null, 2);
  } catch (error) {
    console.error('Error exporting watch later list:', error);
    return '[]';
  }
};

/**
 * Get watch later statistics
 * @param {string} userId - User ID
 * @returns {Object} - Statistics object
 */
export const getWatchLaterStats = (userId) => {
  try {
    const watchLaterList = getWatchLaterList(userId);
    
    if (watchLaterList.length === 0) {
      return {
        totalMovies: 0,
        averageRating: 0,
        oldestMovie: null,
        newestMovie: null,
        topRatedMovie: null
      };
    }

    const totalMovies = watchLaterList.length;
    const averageRating = watchLaterList.reduce((sum, movie) => sum + (movie.vote_average || 0), 0) / totalMovies;
    
    const sortedByDate = [...watchLaterList].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    const sortedByRating = [...watchLaterList].sort((a, b) => b.vote_average - a.vote_average);
    
    return {
      totalMovies,
      averageRating: averageRating.toFixed(1),
      oldestMovie: sortedByDate[0],
      newestMovie: sortedByDate[sortedByDate.length - 1],
      topRatedMovie: sortedByRating[0]
    };
  } catch (error) {
    console.error('Error getting watch later stats:', error);
    return {
      totalMovies: 0,
      averageRating: 0,
      oldestMovie: null,
      newestMovie: null,
      topRatedMovie: null
    };
  }
};