// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Components/Layout"; // Adjust the import path accordingly
import ViewSpace from "./Components/Space/ViewSpace";
import SpacePage from "./Pages/SpacePage";
import SpaceDetailsPage from "./Pages/SpaceDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/view-space"
          element={
            <Layout>
              <ProtectedRoute>
                <SpacePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/space/:spaceId"
          element={
            <Layout>
              <ProtectedRoute>
                <SpaceDetailsPage />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
