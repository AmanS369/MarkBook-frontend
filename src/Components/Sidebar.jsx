import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar, openSidebar } from "../Redux/Slice/sidebarSlice"; // Include an openSidebar action
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Search,
  Settings,
  X,
  ChevronRight,
  ChevronDown,
  File,
} from "lucide-react";
import axios from "axios";

import { TOKEN, logout, selectUser } from "../Redux/Slice/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { spaceId, bitId } = useParams();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const token = useSelector(TOKEN);
  const [spaces, setSpaces] = useState([]);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [expandedSpaces, setExpandedSpaces] = useState({});
  const [selectedBit, setSelectedBit] = useState(null);
  const [isHovering, setIsHovering] = useState(false); // Add hover state

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Navigate to login or home after logout
  };

  useEffect(() => {
    if (spaceId && bitId) {
      setSelectedBit({ spaceId, bitId });
    }
  }, [spaceId, bitId]);

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
    setSelectedBit({ spaceId, bitId });
    navigate(`/bit-editor/${spaceId}/${bitId}`);
  };

  const links = [
    { id: 1, url: "/dashboard", text: "Dashboard", icon: LayoutDashboard },
    { id: 2, url: "/view-space", text: "View Space", icon: Search },
    { id: 3, url: "/settings", text: "Settings", icon: Settings },
  ];

  // Add hover detection for opening the sidebar
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsHovering(true);
      dispatch(openSidebar()); // Open sidebar on hover
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      dispatch(closeSidebar()); // Close sidebar when mouse leaves
    };

    const leftEdge = document.getElementById("hover-edge");

    if (leftEdge) {
      leftEdge.addEventListener("mouseenter", handleMouseEnter);
    }

    const sidebar = document.getElementById("sidebar");

    if (sidebar) {
      sidebar.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (leftEdge) {
        leftEdge.removeEventListener("mouseenter", handleMouseEnter);
      }
      if (sidebar) {
        sidebar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [dispatch]);

  return (
    <>
      {/* Invisible hover edge to detect mouse entry */}
      <div
        id="hover-edge"
        className="fixed inset-y-0 left-0 w-2 z-40" // Small hoverable area on the left edge
      />

      {/* Sidebar */}
      <div
        id="sidebar"
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
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            selectedBit &&
                            selectedBit.spaceId === space._id &&
                            selectedBit.bitId === bit._id
                              ? "bg-indigo-100 text-indigo-800"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          } rounded-md transition-colors duration-150 ease-in-out`}
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
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="px-4 mt-6 flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"></div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
              <p className="text-xs font-light text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
