import { UseUserContext } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../../config/axios";

export default function UserAuth({ children }) {
  const { user, setUser, getUserDetails } = UseUserContext();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-900" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
export const PublicRoute = ({ children }) => {
  const { user, setUser, getUserDetails } = UseUserContext();
  useEffect(() => {
    getUserDetails();
  }, []);
  const token = localStorage.getItem("token");

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
