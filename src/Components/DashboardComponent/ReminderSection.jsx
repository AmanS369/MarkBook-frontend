import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import ReminderItem from "./ReminderItem";

const RemindersSection = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">Reminders</h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="text-blue-500 flex items-center"
      >
        View All <ChevronRight className="h-4 w-4 ml-1" />
      </motion.button>
    </div>
    <ReminderItem title="Team meeting" time="10:00 AM" completed={false} />
    <ReminderItem title="Submit report" time="2:00 PM" completed={false} />
    <ReminderItem title="Call Mom" time="6:00 PM" completed={true} />
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full mt-4 p-2 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center"
    >
      <Plus className="h-5 w-5 mr-2" />
      <span>Add Reminder</span>
    </motion.button>
  </motion.div>
);

export default RemindersSection;
