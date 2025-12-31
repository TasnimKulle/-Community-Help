import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import HelpRequests from "./pages/HelpRequests";
import Tasks from "./pages/Tasks";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help-requests"
                element={
                  <ProtectedRoute>
                    <HelpRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        404
                      </h1>
                      <p className="text-gray-600 mb-6">Page not found</p>
                      <a
                        href="/"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Return to Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
                borderRadius: "10px",
                padding: "16px",
              },
              success: {
                style: {
                  background: "#10b981",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#10b981",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#ef4444",
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
