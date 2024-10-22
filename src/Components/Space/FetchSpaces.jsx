import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";

const fetchRecentSpaces = async (token) => {
  if (!token) {
    throw new Error("No authentication token available");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/spaces`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data.spaces.slice(0, 5);
};

const FetchSpaces = () => {
  const token = useSelector((state) => state.auth.token);

  const {
    data: recentSpaces,
    isLoading,
    error,
  } = useQuery(["recentSpaces", token], () => fetchRecentSpaces(token), {
    enabled: !!token,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching spaces:", error);
    },
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
          Failed to load recent spaces. {error.message}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {recentSpaces?.map((space) => (
        <motion.li
          key={space._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm"
        >
          {space.title}
        </motion.li>
      ))}
    </ul>
  );
};

export default FetchSpaces;
