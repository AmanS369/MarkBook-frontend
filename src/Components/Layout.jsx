import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/Slice/sidebarSlice";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-16 flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 mr-20 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-end items-center">
              {/* Add header content here (e.g., search bar, user profile) */}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
