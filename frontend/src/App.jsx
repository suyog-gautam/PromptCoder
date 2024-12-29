import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "../context/UserContext";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <UserProvider>
        <AppRoutes />;
      </UserProvider>
    </>
  );
}

export default App;
