import React, { useState, useEffect } from "react";
import { useContext, createContext } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const baseurl = import.meta.env.VITE_BASE_URL;

  const value = {
    baseurl,
    user,
    setUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const UseUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
