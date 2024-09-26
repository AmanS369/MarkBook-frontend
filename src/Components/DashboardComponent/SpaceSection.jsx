import React from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, Calendar, Plus } from "lucide-react";
import SpaceButton from "./SpaceButton";

const SpacesSection = () => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Your Spaces</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <SpaceButton name="Work" icon={Home} color="bg-purple-500" />
      <SpaceButton name="Personal" icon={BookOpen} color="bg-green-500" />
      <SpaceButton name="Learning" icon={Calendar} color="bg-yellow-500" />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center p-3 rounded-lg bg-gray-200 text-gray-600 w-full"
      >
        <Plus className="h-5 w-5 mr-2" />
        <span>Create Space</span>
      </motion.button>
    </div>
  </div>
);

export default SpacesSection;
