// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ProtectedRoute from "./Components/ProtectedRoutes";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Components/Layout";
import SpacePage from "./Pages/SpacePage";
import SpaceDetailsPage from "./Pages/SpaceDetails";
import BitEditor from "./Components/Bits/BitEditor";
import Setting from "./Components/Setting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* All authenticated routes wrapped by Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/view-space" element={<SpacePage />} />
          <Route path="/space/:spaceId" element={<SpaceDetailsPage />} />
          <Route path="/bit-editor/:spaceId/:bitId" element={<BitEditor />} />
          <Route path="/settings" element={<Setting />} />
        </Route>

        {/* Redirect any unmatched routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
