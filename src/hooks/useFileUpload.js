import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, auth } from "../Firebase/config.js";

export const useFileUpload = (user, bitId, editorRef) => {
  const handleFileUpload = useCallback(
    async (file, type) => {
      if (!user) {
        throw new Error("User not authenticated. Please log in.");
      }

      try {
        const fileId = uuidv4();
        const fileRef = storageRef(
          storage,
          `users/${auth.currentUser.uid}/bits/${bitId}/${fileId}/${file.name}`,
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
        throw new Error("Failed to upload file. Please try again.");
      }
    },
    [user, bitId, editorRef],
  );

  const deleteFile = useCallback(
    async (fileId) => {
      if (!user) {
        throw new Error("User not authenticated. Please log in.");
      }

      try {
        const fileRef = storageRef(
          storage,
          `users/${auth.currentUser.uid}/bits/${bitId}/${fileId}`,
        );
        await deleteObject(fileRef);
      } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error("Failed to delete file. Please try again.");
      }
    },
    [user, bitId],
  );

  return { handleFileUpload, deleteFile };
};
