import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TOKEN } from "../../Redux/Slice/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import BitEditor from "./BitEditor";

const ViewBits = ({ spaceId, refreshKey }) => {
  const [bits, setBits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector(TOKEN);
  const [selectedBit, setSelectedBit] = useState(null);

  const fetchBits = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces/${spaceId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
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

  const filteredBits = bits.filter(
    (bit) =>
      bit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bit.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return <div className="text-center text-2xl mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-2xl mt-8 text-red-600">{error}</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        />
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
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedBit(bit)}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {bit.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">{bit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      {selectedBit && (
        <BitEditor bit={selectedBit} onClose={() => setSelectedBit(null)} />
      )}
    </div>
  );
};

export default ViewBits;
