import React from "react";
import { motion } from "framer-motion";

const RecentNotes = () => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-2xl font-semibold mb-4">Recent Notes</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {["Project Ideas", "Meeting Notes", "Personal Goals"].map(
        (note, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="p-4 bg-gray-50 rounded-lg cursor-pointer"
          >
            <h3 className="font-semibold">{note}</h3>
            <p className="text-sm text-gray-500">Last edited: 2 hours ago</p>
          </motion.div>
        ),
      )}
    </div>
  </div>
);

export default RecentNotes;
