import { Routes, Route } from "react-router-dom";
import Login from "./pages/Sign_in";
import SignUp from "./pages/Sign_up";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectPage";
import useAutoRefresh from "./autorefresh";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  useAutoRefresh();
  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute> <ProjectDetail /> </ProtectedRoute>} />
      </Routes>
    </>
  );
}


export default App;

