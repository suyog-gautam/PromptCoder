import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Project from "@/pages/Project";
import { Home } from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/project/:projectId" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
