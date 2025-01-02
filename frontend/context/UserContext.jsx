import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axios";
import { useContext, createContext } from "react";
import { get } from "react-hook-form";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const baseurl = import.meta.env.VITE_BASE_URL;
  const [project, setProject] = useState({});

  const getUserDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/users/profile");
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {}
  };
  const getMessages = async (projectId) => {
    try {
      const { data } = await axiosInstance.get(
        `/projects/getProjectMessages/${projectId}`
      );
      if (data.success) {
        setAllMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getProjectDetails = async (projectId) => {
    try {
      const { data } = await axiosInstance.get(
        `/projects/getProject/${projectId}`
      );
      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch project details");
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await axiosInstance.get(`/users/getAll`);

      if (data.success) {
        setAllUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    baseurl,
    user,
    setUser,
    allUsers,
    getAllUsers,
    getProjectDetails,
    getUserDetails,
    project,
    getMessages,
    allMessages,
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
