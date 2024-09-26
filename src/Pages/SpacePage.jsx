import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Grid, List } from "lucide-react";
import ViewSpace from "../Components/Space/ViewSpace";
import CreateSpaceModal from "../Components/Space/CreateSpaceModal";
import { useSelector } from "react-redux";
import { TOKEN } from "../Redux/Slice/authSlice";

const SpacePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isGridView, setIsGridView] = useState(true);
  const token = useSelector((state) => state.auth.token);

  const handleCreateSpace = useCallback(() => {
    setIsModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Your Spaces</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-md shadow-sm p-1 flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded ${
                  isGridView ? "bg-indigo-100 text-indigo-600" : "text-gray-500"
                }`}
                onClick={() => setIsGridView(true)}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded ${
                  !isGridView
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500"
                }`}
                onClick={() => setIsGridView(false)}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Space
            </motion.button>
          </div>
        </div>
        <ViewSpace onRefresh={refreshKey} isGridView={isGridView} />
      </div>
      <CreateSpaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addSpaceToList={handleCreateSpace}
        token={token}
      />
    </div>
  );
};

export default SpacePage;
