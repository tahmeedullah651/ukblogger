import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/home"
                element={<ProtectedRoute element={<Home />} role="consumer" />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute element={<AdminDashboard />} role="creator" />
                }
              />
              <Route path="/video/:id" element={<VideoPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
