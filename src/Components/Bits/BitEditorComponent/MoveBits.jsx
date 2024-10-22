import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const MoveBit = ({ isOpen, onClose, onCreateBit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [reminder, setReminder] = useState("");
  const token = useSelector((state) => state.auth.token);

  const handleCreateQuickBit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/quick-bits/create-quick-bit`,
        { title, description, link, reminder },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Clear form fields
        setTitle("");
        setDescription("");
        setLink("");
        setReminder("");

        // Close the modal
        onClose();

        // Show success notification
        toast.success("Quick Bit created successfully!");

        // Trigger any additional actions (e.g., refreshing the list of bits)
        onCreateBit();
      } else {
        // Show error notification if the server responds with an error
        toast.error(response.data.message || "Failed to create Quick Bit");
      }
    } catch (err) {
      console.error("Failed to create quick bit", err);
      toast.error("Failed to create Quick Bit. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Quick Bit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleCreateQuickBit}>
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
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Link
            </label>
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="reminder"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reminder
            </label>
            <input
              id="reminder"
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
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
              Create Quick Bit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveBit;
