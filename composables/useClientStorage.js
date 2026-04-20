/**
 * Safe localStorage composable that works with SSR
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {Object} - Object with get and set methods
 */
export const useClientStorage = (key, defaultValue = null) => {
  /**
   * Get item from localStorage
   */
  const getItem = () => {
    if (!process.client) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  };

  /**
   * Set item in localStorage
   */
  const setItem = (value) => {
    if (!process.client) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  };

  /**
   * Remove item from localStorage
   */
  const removeItem = () => {
    if (!process.client) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
};

/**
 * Safe way to get token from storage
 */
export const useToken = () => {
  const { getItem, setItem, removeItem } = useClientStorage("token");
  
  return {
    getToken: getItem,
    setToken: setItem,
    removeToken: removeItem,
  };
};

/**
 * Safe way to get user from storage
 */
export const useUser = () => {
  const { getItem, setItem, removeItem } = useClientStorage("_user");
  
  return {
    getUser: getItem,
    setUser: setItem,
    removeUser: removeItem,
  };
};
