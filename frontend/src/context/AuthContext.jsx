import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const login = (userData) => {
    // userData should look like { user: {...}, token: "JWT_HERE" }
    setIsAuthenticated(true);
    setUser(userData.user);
    setToken(userData.token);
    setLoadingAuth(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, loadingAuth, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
