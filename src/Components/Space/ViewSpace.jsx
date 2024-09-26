// ViewSpace.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TOKEN } from "../../Redux/Slice/authSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ViewSpace = ({ onRefresh, isGridView }) => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector(TOKEN);
  const navigate = useNavigate();

  const fetchSpaces = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSpaces(response.data.spaces);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch spaces");
      setLoading(false);
    }
  }, [token]);
  const handleSpaceClick = (spaceId) => {
    navigate(`/space/${spaceId}`);
  };

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces, onRefresh]);

  if (loading)
    return <div className="text-center text-2xl mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-2xl mt-8 text-red-600">{error}</div>
    );

  const getConsistentColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 70%)`;
    return color;
  };

  return (
    <div
      className={`grid gap-6 ${
        isGridView ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      }`}
    >
      {spaces.map((space) => (
        <motion.div
          key={space._id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer ${
            isGridView ? "" : "flex"
          }`}
          onClick={() => handleSpaceClick(space._id)}
        >
          <div
            className={`${
              isGridView ? "h-32 w-full" : "h-32 w-32"
            } flex items-center justify-center text-white text-4xl font-bold`}
            style={{
              backgroundColor: getConsistentColor(space.title || "Untitled"),
            }}
          >
            {space.title ? space.title[0].toUpperCase() : "S"}
          </div>
          <div className={`p-6 ${isGridView ? "" : "flex-grow"}`}>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {space.title || "Untitled Space"}
            </h2>
            <p className="text-gray-600 text-sm">
              {space.description || "No description available"}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ViewSpace;
