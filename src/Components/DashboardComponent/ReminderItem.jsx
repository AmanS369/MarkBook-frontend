import React from "react";
import { motion } from "framer-motion";

const ReminderItem = ({ title, time, completed }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-between p-3 bg-white rounded-lg shadow mb-2"
  >
    <div className="flex items-center">
      <input type="checkbox" checked={completed} className="mr-3" readOnly />
      <span className={completed ? "line-through text-gray-500" : ""}>
        {title}
      </span>
    </div>
    <span className="text-sm text-gray-500">{time}</span>
  </motion.div>
);

export default ReminderItem;
