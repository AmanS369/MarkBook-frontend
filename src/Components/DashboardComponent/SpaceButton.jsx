import React from "react";
import { motion } from "framer-motion";

const SpaceButton = ({ name, icon: Icon, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center p-3 rounded-lg text-white ${color} shadow-lg w-full`}
  >
    <Icon className="h-5 w-5 mr-2" />
    <span>{name}</span>
  </motion.button>
);

export default SpaceButton;
