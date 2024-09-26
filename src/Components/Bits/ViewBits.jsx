import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TOKEN } from "../../Redux/Slice/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Search, File } from "lucide-react";

const ViewBits = ({ spaceId, refreshKey }) => {
  const [bits, setBits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector(TOKEN);
  const navigate = useNavigate();

  const fetchBits = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces/${spaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data.space.bits);
      setBits(response.data.space.bits || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch bits");
      setLoading(false);
    }
  }, [spaceId, token]);

  useEffect(() => {
    fetchBits();
  }, [fetchBits, refreshKey]);

  const handleBitClick = (bitId) => {
    navigate(`/bit-editor/${spaceId}/${bitId}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-2xl text-red-600 bg-red-100 p-4 rounded-lg shadow">
          {error}
        </div>
      </div>
    );

  const filteredBits = bits.filter(
    (bit) =>
      (bit.title &&
        bit.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bit.description &&
        bit.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search bits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBits.map((bit) => (
            <motion.div
              key={bit._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleBitClick(bit._id)}
            >
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <File className="h-5 w-5 text-indigo-500 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {bit.title}
                  </h3>
                </div>
                <p className="text-gray-600 line-clamp-3">{bit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      {filteredBits.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No bits found. Try adjusting your search or create a new bit.
        </div>
      )}
    </div>
  );
};

export default ViewBits;
