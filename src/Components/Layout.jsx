import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../Redux/Slice/sidebarSlice";
import Sidebar from "./Sidebar";
import { Menu, Zap, Search } from "lucide-react";
import QuickBitModal from "./QuickBit/QuickBitModal";
import { Outlet, useNavigate } from "react-router-dom";
import { TOKEN } from "../Redux/Slice/authSlice";
import axios from "axios";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(TOKEN);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const [isQuickBitModalOpen, setIsQuickBitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        performSearch();
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/search?q=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchError("An error occurred while searching. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleResultClick = (result) => {
    if (result.type === "space") {
      navigate(`/space/${result.id}`);
    } else if (result.type === "bit") {
      navigate(`/bit-editor/${result.spaceId}/${result.id}`);
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen bg-stone-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 flex-1 max-w-2xl relative" ref={searchRef}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search spaces, bits, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                {isSearchOpen &&
                  (searchResults.length > 0 || isSearching || searchError) && (
                    <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden">
                      {isSearching && (
                        <div className="p-4 text-center text-gray-500">
                          Searching...
                        </div>
                      )}
                      {searchError && (
                        <div className="p-4 text-center text-red-500">
                          {searchError}
                        </div>
                      )}
                      {!isSearching &&
                        !searchError &&
                        searchResults.length > 0 && (
                          <ul className="divide-y divide-gray-200">
                            {searchResults.map((result) => (
                              <li
                                key={result.id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleResultClick(result)}
                              >
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-900">
                                    {result.title}
                                  </span>
                                  <span className="ml-2 text-xs text-gray-500">
                                    {result.type}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {result.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      {!isSearching &&
                        !searchError &&
                        searchResults.length === 0 &&
                        searchQuery && (
                          <div className="p-4 text-center text-gray-500">
                            No results found
                          </div>
                        )}
                    </div>
                  )}
              </div>
            </div>
            <button
              onClick={() => setIsQuickBitModalOpen(true)}
              className="ml-4 flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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
