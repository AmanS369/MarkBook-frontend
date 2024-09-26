import React from "react";
import { motion } from "framer-motion";
import { Bell, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../Redux/Slice/sidebarSlice";

const Header = ({ greeting, currentTime }) => {
  const dispatch = useDispatch();

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{greeting}, Alex</h1>
          <p className="text-gray-600">{currentTime} | It's time to focus</p>
        </div>
      </div>
      <div className="flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white p-2 rounded-full mr-4"
        >
          <Bell className="h-6 w-6" />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white p-1 rounded-full"
        >
          <img
            src="/api/placeholder/40/40"
            alt="Profile"
            className="h-8 w-8 rounded-full"
          />
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
