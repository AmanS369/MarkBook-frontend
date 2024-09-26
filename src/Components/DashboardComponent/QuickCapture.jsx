import React from "react";
import { motion } from "framer-motion";

const QuickCapture = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
    <h2 className="text-2xl font-semibold mb-4">Quick Capture</h2>
    <div className="flex">
      <input
        type="text"
        placeholder="Type your thought here..."
        className="flex-grow p-3 rounded-l-lg border-2 border-r-0 border-gray-200 focus:outline-none focus:border-blue-500"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white p-3 rounded-r-lg"
      >
        Capture
      </motion.button>
    </div>
  </div>
);

export default QuickCapture;
