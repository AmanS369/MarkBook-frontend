import React, { useState } from "react";
import axios from "axios";

const CreateBitModal = ({
  isOpen,
  onClose,
  onCreateBit, // New prop to trigger refresh
  spaceId,
  token,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateBit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/bits/create-bit`,
        { title, link: null, description, remainder: null, spaceId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTitle("");
      setDescription("");
      onCreateBit(); // Call the callback function after creating a bit
    } catch (err) {
      console.error("Failed to create bit", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Create New Bit</h2>
        <form onSubmit={handleCreateBit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Bit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBitModal;
