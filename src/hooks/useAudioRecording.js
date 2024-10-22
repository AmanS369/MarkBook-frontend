import { useState, useRef, useCallback } from "react";

export const useAudioRecording = (user, handleFileUpload) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);
  const mediaChunksRef = useRef([]);
  const recorderRef = useRef(null);

  const startRecording = useCallback(async () => {
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
        try {
          await handleFileUpload(audioBlob, "audio");
        } catch (uploadError) {
          setError("Failed to upload audio. Please try again.");
          console.error("Error uploading audio:", uploadError);
        }
      };

      recorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError(
        "Failed to start recording. Please check your microphone permissions.",
      );
      setIsRecording(false);
    }
  }, [user, handleFileUpload]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioURL,
    error,
    setError,
  };
};
