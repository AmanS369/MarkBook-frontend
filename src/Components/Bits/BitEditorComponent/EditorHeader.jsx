import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react"; // Removed PlusCircle since it's no longer used

import { Grip, Mic } from "lucide-react";

const EditorHeader = ({
  title,
  setTitle,
  navigate,
  isRecording,
  isSaving,
  lastSaved,
  saveToFirebase,
  spaceId,
  token,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/view-space`)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold focus:outline-none"
            placeholder="Untitled"
          />
        </div>
        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center text-red-500">
              <Mic className="h-5 w-5 mr-2 animate-pulse" />
              Recording...
            </div>
          )}
          <span className="text-sm text-gray-500">
            {isSaving
              ? "Saving..."
              : lastSaved
                ? `Last saved ${lastSaved.toLocaleTimeString()}`
                : ""}
          </span>
          {/* Button to open MoveBits modal */}

          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={saveToFirebase}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>
      {/* MoveBits Modal */}
    </header>
  );
};

export default EditorHeader;
