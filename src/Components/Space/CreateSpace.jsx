import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { TOKEN } from "../../Redux/Slice/authSlice";

const CreateSpace = ({ addSpaceToList }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const token = useSelector(TOKEN);

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces/`,
        { name, description, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Add the newly created space to the list
      addSpaceToList(response.data.space);
      setName("");
      setDescription("");
      setPrice("");
    } catch (err) {
      console.error("Failed to create space", err);
    }
  };

  return (
    <form onSubmit={handleCreateSpace} className="mt-8">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Space Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter space name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter description"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Price
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter price per night"
        />
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300"
      >
        Create Space
      </button>
    </form>
  );
};

export default CreateSpace;
