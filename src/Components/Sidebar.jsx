import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../Redux/Slice/sidebarSlice";
import { Link } from "react-router-dom";
import { Home, Search, Settings, X } from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  const links = [
    { id: 1, url: "/", text: "Home", icon: Home },
    { id: 2, url: "/view-space", text: "View Space", icon: Search },
    { id: 3, url: "/settings", text: "Settings", icon: Settings },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col py-6 overflow-y-auto">
        <div className="px-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Mark <span className="text-indigo-600">Book</span>
          </h2>
          <button
            onClick={() => dispatch(closeSidebar())}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.id}
              to={link.url}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors duration-150 ease-in-out"
            >
              <link.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{link.text}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 mt-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
