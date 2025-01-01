import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Project from "@/pages/Project";
import { Home } from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserAuth from "@/auth/UserAuth";
import { PublicRoute } from "@/auth/UserAuth";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserAuth>
              <Home />{" "}
            </UserAuth>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <UserAuth>
              <Project />
            </UserAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
