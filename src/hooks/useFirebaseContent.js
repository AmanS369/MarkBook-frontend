import { useState, useEffect, useCallback } from "react";
import { ref, get, set, onValue, off } from "firebase/database";
import { database, auth } from "../Firebase/config.js";
import debounce from "lodash.debounce";

export const useFirebaseContent = (bitId, user) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError("User not authenticated. Please log in.");
      setIsLoading(false);
      return;
    }
    // console.log("this is use", auth.currentUser);
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
    };
  }, [bitId, user]);

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

  return {
    content,
    setContent,
    title,
    setTitle,
    isSaving,
    lastSaved,
    error,
    isLoading,
    saveToFirebase: debouncedSaveToFirebase,
  };
};
