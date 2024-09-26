import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ref, get, set, onValue, off } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { database, storage, auth } from "../../firebase/config";
import { selectUser, FIREBASE_TOKEN } from "../../Redux/Slice/authSlice";
import debounce from "lodash.debounce"; // Import debounce for saving

const BitEditor = ({ bit, onClose }) => {
  const user = useSelector(selectUser);
  const [content, setContent] = useState(bit.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const quillRef = useRef(null);

  useEffect(() => {
    const bitRef = ref(
      database,
      `users/${auth.currentUser.uid}/bits/${bit._id}`,
    );

    const fetchInitialContent = async () => {
      try {
        const snapshot = await get(bitRef);
        const data = snapshot.val();
        if (data) {
          setContent(data.content);
          setLastSaved(new Date(data.lastSaved));
        }
      } catch (error) {
        console.error("Error fetching initial content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialContent();

    const handleDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setContent(data.content);
        setLastSaved(new Date(data.lastSaved));
      }
    };

    onValue(bitRef, handleDataChange);

    return () => {
      off(bitRef, "value", handleDataChange);
    };
  }, [bit._id]);

  const saveToFirebase = useCallback(
    async (newContent) => {
      setIsSaving(true);
      const bitRef = ref(
        database,
        `users/${auth.currentUser.uid}/bits/${bit._id}`,
      );
      try {
        await set(bitRef, {
          ...bit,
          content: newContent,
          lastSaved: new Date().toISOString(),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving to Firebase:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [bit],
  );

  // Debounced version of saveToFirebase to avoid saving on every keystroke
  const debouncedSaveToFirebase = useCallback(
    debounce((newContent) => {
      saveToFirebase(newContent);
    }, 1000), // 1 second delay
    [saveToFirebase],
  );

  const handleContentChange = (newContent) => {
    setContent(newContent);
    debouncedSaveToFirebase(newContent);
  };

  const handleImageUpload = useCallback(() => {
    if (!user) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const fileRef = storageRef(storage, `users/${user.uid}/bits/${uuidv4()}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, "image", url);
    };
  }, [user]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{bit.title}</h2>
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading content...</p>
          </div>
        ) : (
          <div className="flex-grow overflow-auto">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              className="h-[400px] mb-12"
            />
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {isSaving
              ? "Saving..."
              : lastSaved
              ? `Last saved: ${lastSaved.toLocaleTimeString()}`
              : ""}
          </span>
          <div>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitEditor;
