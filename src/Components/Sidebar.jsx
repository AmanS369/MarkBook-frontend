import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../Redux/Slice/sidebarSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Settings,
  X,
  ChevronRight,
  ChevronDown,
  File,
} from "lucide-react";
import axios from "axios";
import { TOKEN, selectUser } from "../Redux/Slice/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const token = useSelector(TOKEN);
  const [spaces, setSpaces] = useState([]);
  const user = useSelector(selectUser);
  const [expandedSpaces, setExpandedSpaces] = useState({});

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSpaces(response.data.spaces || []);
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
    }
  };

  const toggleSpace = async (spaceId) => {
    setExpandedSpaces((prev) => {
      const newExpandedSpaces = { ...prev, [spaceId]: !prev[spaceId] };

      if (newExpandedSpaces[spaceId]) {
        fetchBits(spaceId);
      }

      return newExpandedSpaces;
    });
  };

  const fetchBits = async (spaceId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/spaces/${spaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space._id === spaceId
            ? { ...space, bits: response.data.space.bits }
            : space,
        ),
      );
    } catch (error) {
      console.error(`Failed to fetch bits for space ${spaceId}:`, error);
    }
  };

  const navigateToBit = (spaceId, bitId) => {
    navigate(`/bit-editor/${spaceId}/${bitId}`);
  };

  const links = [
    { id: 1, url: "/", text: "Home", icon: Home },
    { id: 2, url: "/view-space", text: "View Space", icon: Search },
    { id: 3, url: "/settings", text: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } font-sans`}
    >
      <div className="h-full flex flex-col py-6 overflow-y-auto">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Mark <span className="text-indigo-600">Book</span>
          </h2>
          <button
            onClick={() => dispatch(closeSidebar())}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.id}
              to={link.url}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
            >
              <link.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{link.text}</span>
            </Link>
          ))}
          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Spaces
            </h3>
            {spaces.map((space) => (
              <div key={space._id} className="mt-1">
                <button
                  onClick={() => toggleSpace(space._id)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                >
                  <span className="font-medium">{space.title}</span>
                  {expandedSpaces[space._id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedSpaces[space._id] && space.bits && (
                  <div className="ml-4 mt-1 space-y-1">
                    {space.bits.map((bit) => (
                      <button
                        key={bit._id}
                        onClick={() => navigateToBit(space._id, bit._id)}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                      >
                        <File className="h-4 w-4 mr-2" />
                        <span>{bit.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
        <div className="px-4 mt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
