import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { ref, get, set, onValue, off } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { database, storage, auth } from "../../firebase/config";
import { selectUser } from "../../Redux/Slice/authSlice";
import debounce from "lodash.debounce";
import { ArrowLeft, Save, Upload, Mic, Image, Video, X } from "lucide-react";
import WithAuth from "./WithAuth";
const BitEditor = () => {
  const { spaceId, bitId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const mediaChunksRef = useRef([]);
  const recorderRef = useRef(null);
  const autoSaveIntervalRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      setIsLoading(false);
      return;
    }

    const bitRef = ref(database, `users/${auth.currentUser.uid}/bits/${bitId}`);
    const fetchInitialContent = async () => {
      try {
        const snapshot = await get(bitRef);
        const data = snapshot.val();
        if (data) {
          setContent(data.content);
          setTitle(data.title);
          setLastSaved(new Date(data.lastSaved));
        }
      } catch (error) {
        console.error("Error fetching initial content:", error);
        setError("Failed to load content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialContent();

    const handleDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setContent(data.content);
        setTitle(data.title);
        setLastSaved(new Date(data.lastSaved));
      }
    };

    onValue(bitRef, handleDataChange);

    return () => {
      off(bitRef, "value", handleDataChange);
      // Clear auto-save interval on component unmount
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [bitId, user, title]);

  const saveToFirebase = useCallback(
    async (newContent, newTitle) => {
      if (!user) {
        setError("User not authenticated. Please log in.");
        return;
      }

      setIsSaving(true);
      const bitRef = ref(
        database,
        `users/${auth.currentUser.uid}/bits/${bitId}`,
      );
      try {
        await set(bitRef, {
          _id: bitId,
          content: newContent,
          title: newTitle,
          lastSaved: new Date().toISOString(),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving to Firebase:", error);
        setError("Failed to save content. Please try again.");
      } finally {
        setIsSaving(false);
      }
    },
    [bitId, user],
  );

  const debouncedSaveToFirebase = useCallback(
    debounce((newContent, newTitle) => {
      saveToFirebase(newContent, newTitle);
    }, 1000),
    [saveToFirebase],
  );

  // const handleEditorChange = (newContent, editor) => {
  //   setContent(newContent);
  //   debouncedSaveToFirebase(newContent, title);
  // };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSaveToFirebase(content, newTitle);
  };

  const handleEditorChange = (newContent, editor) => {
    const cursorPosition = editor.selection.getBookmark(2, true);
    setContent(newContent);
    debouncedSaveToFirebase(newContent, title);
    editor.selection.moveToBookmark(cursorPosition);
  };

  const handleFileUpload = async (file, type) => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const fileId = uuidv4();
      const fileRef = storageRef(
        storage,
        `users/${auth.currentUser.uid}/bits/${bitId}/${fileId}`,
      );
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      let embedCode = "";
      switch (type) {
        case "image":
          embedCode = `<img src="${url}" alt="Uploaded image" data-file-id="${fileId}" />`;
          break;
        case "video":
          embedCode = `<video controls><source src="${url}" type="video/mp4" data-file-id="${fileId}"></video>`;
          break;
        case "audio":
          embedCode = `<audio controls><source src="${url}" type="audio/mpeg" data-file-id="${fileId}"></audio>`;
          break;
        default:
          embedCode = `<a href="${url}" target="_blank" data-file-id="${fileId}">${file.name}</a>`;
      }

      editorRef.current.insertContent(embedCode);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    }
  };

  const deleteFile = useCallback(
    async (fileId) => {
      if (!user) {
        setError("User not authenticated. Please log in.");
        return;
      }

      try {
        const fileRef = storageRef(
          storage,
          `users/${auth.currentUser.uid}/bits/${bitId}/${fileId}`,
        );
        await deleteObject(fileRef);
      } catch (error) {
        console.error("Error deleting file:", error);
        setError("Failed to delete file. Please try again.");
      }
    },
    [user, bitId],
  );

  const startRecording = async () => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(stream);
      mediaChunksRef.current = [];

      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };

      recorderRef.current.onstop = async () => {
        const audioBlob = new Blob(mediaChunksRef.current, {
          type: "audio/mpeg",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        await handleFileUpload(audioBlob, "audio");
      };

      recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Failed to start recording. Please check your microphone permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
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
              onChange={handleTitleChange}
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
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => saveToFirebase(content, title)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex space-x-2">
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
            onClick={isRecording ? stopRecording : startRecording}
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
        <Editor
          apiKey="hy1u24zp9qwz4rzxmoejgj7v7gi7qq6i6c8xvonqfngunvzk"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={content}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
              "codesample",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help | codesample | image",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            codesample_languages: [
              { text: "HTML/XML", value: "markup" },
              { text: "JavaScript", value: "javascript" },
              { text: "CSS", value: "css" },
              { text: "PHP", value: "php" },
              { text: "Ruby", value: "ruby" },
              { text: "Python", value: "python" },
              { text: "Java", value: "java" },
              { text: "C", value: "c" },
              { text: "C#", value: "csharp" },
              { text: "C++", value: "cpp" },
            ],
            setup: (editor) => {
              editor.on("NodeChange", (e) => {
                const node = e.element;
                if (node.getAttribute("data-file-id")) {
                  const fileId = node.getAttribute("data-file-id");
                  const deleteButton = editor.dom.create(
                    "button",
                    {
                      class: "delete-file-button",
                      style:
                        "position: absolute; top: 0; right: 0; background: red; color: white; border: none; padding: 2px 5px; cursor: pointer;",
                    },
                    "X",
                  );
                  editor.dom.insertAfter(deleteButton, node);
                  editor.dom.bind(deleteButton, "click", (e) => {
                    e.preventDefault();
                    deleteFile(fileId);
                    editor.dom.remove(node);
                    editor.dom.remove(deleteButton);
                  });
                }
              });
              editor.on("keydown", (e) => {
                if (e.key === "/") {
                  editor.execCommand("InsertUnorderedList");
                  e.preventDefault();
                }
              });
            },
          }}
          onEditorChange={handleEditorChange}
        />
      </main>
    </div>
  );
};

export default WithAuth(BitEditor);
