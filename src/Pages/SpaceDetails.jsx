import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { TOKEN } from "../Redux/Slice/authSlice";
import ViewBits from "../Components/Bits/ViewBits";
import CreateBitModal from "../Components/Bits/CreateBitModal";

const SpaceDetailsPage = () => {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = useSelector(TOKEN);

  const fetchSpaceDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces/${spaceId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      setSpace(response.data.space);
    } catch (err) {
      console.error("Failed to fetch space details", err);
    }
  }, [spaceId, token]);

  useEffect(() => {
    fetchSpaceDetails();
  }, [fetchSpaceDetails]);

  const handleCreateBit = useCallback(() => {
    setIsModalOpen(false);
    setRefreshKey((prevKey) => prevKey + 1);
  }, []);

  if (!space)
    return <div className="text-center text-2xl mt-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{space.title}</h1>
        <p className="mt-2 text-gray-600">{space.description}</p>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Bits</h2>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsModalOpen(true)}
        >
          Create Bit
        </button>
      </div>
      <ViewBits spaceId={spaceId} refreshKey={refreshKey} />
      <CreateBitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBit={handleCreateBit}
        spaceId={spaceId}
        token={token}
      />
    </div>
  );
};

export default SpaceDetailsPage;
