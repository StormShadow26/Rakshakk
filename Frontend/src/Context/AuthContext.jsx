import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user from API
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/check', {
        credentials: 'include', // Important: sends cookies!
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // Persist the user in localStorage after login
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // UseEffect to check for the user when the component mounts
  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Load user from localStorage
      setLoading(false); // No need to fetch from API if user is already found in localStorage
    } else {
      fetchUser(); // If no user is found in localStorage, fetch from API
    }
  }, []);

  const logout = () => {
    setUser(null); // Remove user from state
    localStorage.removeItem("user"); // Clear user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
