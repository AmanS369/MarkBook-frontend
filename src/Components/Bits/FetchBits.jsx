import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

const fetchRecentBits = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/bits`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data.bits.slice(0, 5);
};

const FetchBits = () => {
  const token = useSelector((state) => state.auth.token);

  const {
    data: recentBits,
    isLoading,
    error,
  } = useQuery(["recentBits", token], () => fetchRecentBits(token), {
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
          <h4 className="text-red-500 dark:text-red-400 font-semibold">
            Error
          </h4>
        </div>
        <p className="text-red-500 dark:text-red-400 mt-2">
          Failed to load recent bits. {error.message}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {recentBits?.map((bit) => (
        <motion.li
          key={bit._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm"
        >
          {bit.title}
        </motion.li>
      ))}
    </ul>
  );
};

export default FetchBits;
