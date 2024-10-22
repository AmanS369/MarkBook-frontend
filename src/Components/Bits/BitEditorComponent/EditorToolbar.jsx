import React from "react";
import { Upload, Mic, Image, Video } from "lucide-react";

const EditorToolbar = ({
  handleFileUpload,
  isRecording,
  startRecording,
  stopRecording,
  error,
  setError,
}) => {
  const handleRecordingClick = async () => {
    try {
      if (isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    } catch (err) {
      console.error("Recording error:", err);
      setError(err.message || "An error occurred during recording.");
    }
  };

  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        <button
          onClick={() => document.getElementById("file-upload").click()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0], "file")}
        />
        <button
          onClick={handleRecordingClick}
          className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isRecording ? "bg-red-100" : ""
          }`}
        >
          <Mic className="h-4 w-4 mr-2" />
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button
          onClick={() => document.getElementById("image-upload").click()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Image className="h-4 w-4 mr-2" />
          Upload Image
        </button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0], "image")}
        />
        <button
          onClick={() => document.getElementById("video-upload").click()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Video className="h-4 w-4 mr-2" />
          Upload Video
        </button>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0], "video")}
        />
      </div>
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default EditorToolbar;
