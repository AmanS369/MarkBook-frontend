import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { selectUser } from "../../../Redux/Slice/authSlice";
import WithAuth from "./WithAuth";
import EditorHeader from "./EditorHeader";
import EditorToolbar from "./EditorToolbar";
import { useFirebaseContent } from "../../../hooks/useFirebaseContent.js";
import { useFileUpload } from "../../../hooks/useFileUpload.js";
import { useAudioRecording } from "../../../hooks/useAudioRecording.js";
import { configureEditor } from "../../../utils/editorConfig.js";

const BitEditor = () => {
  const { bitId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const editorRef = useRef(null);

  const {
    content,
    setContent,
    title,
    setTitle,
    isSaving,
    lastSaved,
    error,
    isLoading,
    saveToFirebase,
  } = useFirebaseContent(bitId, user);

  const { handleFileUpload, deleteFile } = useFileUpload(
    user,
    bitId,
    editorRef,
  );

  const { isRecording, startRecording, stopRecording, audioURL } =
    useAudioRecording(user, handleFileUpload);

  const handleEditorChange = useCallback(
    (newContent, editor) => {
      const bookmark = editor.selection.getBookmark(2, true);
      setContent(newContent);
      saveToFirebase(newContent, title);
      setTimeout(() => {
        editor.selection.moveToBookmark(bookmark);
      }, 0);
    },
    [setContent, saveToFirebase, title],
  );

  const handleTitleChange = useCallback(
    (newTitle) => {
      setTitle(newTitle);
      saveToFirebase(content, newTitle);
    },
    [setTitle, saveToFirebase, content],
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <EditorHeader
        title={title}
        setTitle={handleTitleChange}
        navigate={navigate}
        isRecording={isRecording}
        isSaving={isSaving}
        lastSaved={lastSaved}
        saveToFirebase={() => saveToFirebase(content, title)}
      />
      <main className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <EditorToolbar
          handleFileUpload={handleFileUpload}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
        <Editor
          apiKey="hy1u24zp9qwz4rzxmoejgj7v7gi7qq6i6c8xvonqfngunvzk"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={content}
          init={configureEditor(deleteFile)}
          onEditorChange={handleEditorChange}
        />
      </main>
    </div>
  );
};

export default WithAuth(BitEditor);
