import React from "react";
import { UseUserContext } from "../../context/UserContext";
export const Home = () => {
  const { user } = UseUserContext();
  return (
    <>
      <div className="flex flex-col min-h-[90vh] h-full w-full items-center justify-center px-4 text-blue-300">
        Home Page
      </div>
      <div className="mt-4 text-center text-sm pb-6">
        {user && <p>Welcome {user.email}</p>}
      </div>
    </>
  );
};
