// Home.jsx
import React from "react";
import { FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/Slice/sidebarSlice"; // Adjust the path accordingly

const Home = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  return (
    <main>
      <button
        onClick={() => dispatch(toggleSidebar())} // Dispatch toggle action
        className={`${
          isSidebarOpen ? "-translate-x-8" : "translate-x-0"
        } fixed top-2 transition transform ease-linear duration-500 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-300 focus:outline-none ml-6 hover:bg-gray-200 hover:text-gray-800`}
      >
        <FaBars className="w-5 h-5" />
      </button>
    </main>
  );
};

export default Home;
