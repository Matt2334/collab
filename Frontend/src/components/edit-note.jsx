import { useDebounce } from "use-debounce";
import styled from "styled-components";
import React, { useState, useEffect } from "react";

const NoteMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgb(249, 250, 251);
  overflow: hidden;
`;
const NoteHeader = styled.div`
  padding: 1rem 2rem;
  background: rgb(247 248 255);
  border-bottom: 1px solid oklch(0.92 0.01 280);
  flex-shrink: 0;

  input {
    width: 100%;
    font-size: 15px;
    font-weight: 600;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;

    &::placeholder {
      color: oklch(0.75 0.02 280);
    }
  }
`;
const NoteEditor = styled.textarea`
  flex: 1;
  padding: 2rem;
  background-color: rgb(247 248 255);
  border: none;
  outline: none;
  font-size: 13px;
  //   line-height: 1.7;
  color: oklch(0.3 0.02 280);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    sans-serif;
  resize: none;
`;
const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: oklch(0.65 0.02 280);
  text-align: center;
  padding: 2rem;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: oklch(0.45 0.02 280);
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;
function EditNote({ roomID, noteID, onNoteUpdated }) {
  const [isSaving, setIsSaving] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [debouncedContent] = useDebounce(noteContent, 500);
  const [debouncedTitle] = useDebounce(noteTitle, 500);

  useEffect(() => {
    if (noteID) {
      getNote();
    }
  }, [noteID]);

  useEffect(() => {
    if (
      noteID &&
      debouncedContent !== undefined &&
      noteContent !== "" &&
      debouncedTitle !== undefined &&
      noteTitle !== ""
    ) {
      saveNote();
    }
  }, [debouncedTitle, debouncedContent]);

  const getNote = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/note/${roomID}/notes/${noteID}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 404) {
        console.log("Note not found");
        setNoteContent("");
        setNoteTitle("");
        return;
      }
      const data = await response.json();
      setNoteContent(data.content || "");
      setNoteTitle(data.title || "");
    } catch (err) {
      console.error("Error fetching note:", err);
    }
  };
  const saveNote = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/note/${roomID}/notes/${noteID}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: noteTitle, content: debouncedContent }),
        }
      );
      const updatedNote = await response.json();
      if (onNoteUpdated) {
        onNoteUpdated(updatedNote);
      }
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <NoteMain>
      {noteID ? (
        <>
          <NoteHeader>
            {isSaving && <span>Saving...</span>}
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Untitled note"
            />
          </NoteHeader>
          <NoteEditor
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Start writing..."
          />
        </>
      ) : (
        <EmptyState>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          </svg>
          <h3>No note selected</h3>
          <p>Select a note from the sidebar to start editing</p>
        </EmptyState>
      )}
    </NoteMain>
  );
}
export default EditNote;
