import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/Slice/sidebarSlice";
import Sidebar from "./Sidebar";
import { Menu, Zap } from "lucide-react";
import QuickBitModal from "./QuickBit/QuickBitModal";
import { Outlet } from "react-router-dom";
import { TOKEN } from "../Redux/Slice/authSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const [isQuickBitModalOpen, setIsQuickBitModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-10xl mx-auto px-2 sm:px-4 lg:px-6 h-16 flex items-center justify-between">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsQuickBitModalOpen(true)}
              className="flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Zap className="h-6 w-6 mr-2" />
              <span>Quick Bit</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-50">
          <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <QuickBitModal
        isOpen={isQuickBitModalOpen}
        onClose={() => setIsQuickBitModalOpen(false)}
        token={TOKEN}
      />
    </div>
  );
};

export default Layout;
