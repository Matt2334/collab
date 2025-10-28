import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
const Wrap = styled.div`
  background-color: #ffffff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const Top = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid oklch(0.92 0.01 280);
  padding: 0.75rem 1.5rem;
  flex-shrink: 0;
  position: relative;
`;
const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  color: oklch(0.45 0.02 280);
  transition: all 0.2s ease;

  &:hover {
    background-color: oklch(0.95 0.01 280);
    color: oklch(0.25 0.02 280);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
const Title = styled.div`
  flex: 1;
  h1 {
    font-size: 18px;
    color: oklch(0.25 0.02 280);
  }
  h2 {
    font-size: 14px;
    color: oklch(0.55 0.02 280);
    margin: 0;
  }
`;
const InviteButton = styled.button`
  background-color: oklch(0.98 0.01 280);
  border: 1px solid oklch(0.92 0.01 280);
  border-radius: 0.7rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  align-items: center;
  display: flex;
  color: oklch(0.35 0.02 280);
  position: absolute;
  right: 2rem;
  top: 1.5rem;
  gap: 0.5rem;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: oklch(0.95 0.01 280);
    border-color: oklch(0.85 0.01 280);
  }
`;

const Bottom = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;
const SideBar = styled.aside`
  width: 450px;
  border-right: 1px solid oklch(0.92 0.01 280);
  overflow-y: auto;
  flex-shrink: 0;
  background: white;
`;
const NoteCard = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: 1rem;
  gap: 0.75rem;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  background: ${(props) =>
    props.$active ? "oklch(0.97 0.01 280)" : "transparent"};
  border-left: 3px solid
    ${(props) => (props.$active ? "oklch(0.55 0.15 280)" : "transparent")};

  &:hover {
    background: oklch(0.97 0.01 280);
  }

  svg {
    width: 16px;
    height: 16px;
    color: oklch(0.55 0.02 280);
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const NoteCardContent = styled.div`
  flex: 1;
  min-width: 0;
  h3 {
    font-size: 14px;
    margin: 0 0 0.5rem 0;
    color: oklch(0.25 0.02 280);
    font-weight: 100;
  }
  p {
    color: oklch(0.55 0.02 280);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 0 0 0.5rem 0;
  }
`;
const NoteCardMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 12px;
  color: oklch(0.65 0.02 280);
`;

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
const ErrorMessage = styled.div`
  margin: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  font-size: 14px;
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
function Rooms() {
  const [roomInfo, setRoomInfo] = useState([]);
  const [m, setM] = useState("");
  const { id } = useParams();

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  useEffect(() => {
    fetch(`http://localhost:3000/api/note/${id}/notes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 403) {
          setM("You must be logged in to perform this action");
        } else if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          setM(data.message);
        } else {
          setRoomInfo(data);
        }
      });
  }, [id]);
  const mockNotes = [
    {
      id: 1,
      title: "Feature Requirements",
      info: "Core features for the Q1 release including user authentication, real-time collaboration, and workspace management.",
      author: "Alice Johnson",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      title: "Technical Architecture",
      info: "System design and infrastructure decisions for the new platform.",
      author: "Bob Smith",
      lastUpdated: "5 hours ago",
    },
    {
      id: 3,
      title: "User Research Findings",
      info: "Key insights from user interviews and usability testing sessions.",
      author: "Carol Martinez",
      lastUpdated: "1 day ago",
    },
  ];
  useEffect(() => {
    if (mockNotes.length > 0 && selectedNoteId === null) {
      setSelectedNoteId(mockNotes[0].id);
      setNoteTitle(mockNotes[0].title);
      setNoteContent(mockNotes[0].info);
    }
  }, []);
  const handleNoteSelect = (note) => {
    setSelectedNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.info);
  };
  const selectedNote = mockNotes.find((note) => note.id === selectedNoteId);

  return (
    <Wrap>
      <Top>
        <div>
          <BackButton to="/dashboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left w-4 h-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </BackButton>
        </div>
        <Title>
          <h1>Product Planning</h1>
          <h2>Q1 2025 roadmap and feature specs</h2>
        </Title>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InviteButton>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-users w-4 h-4 mr-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Invite
          </InviteButton>
        </div>
      </Top>
      {m && <ErrorMessage>{m}</ErrorMessage>}
      <Bottom>
        <SideBar>
          {mockNotes.map((note) => (
            <NoteCard
              key={note.id}
              $active={selectedNoteId === note.id}
              onClick={() => handleNoteSelect(note)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              <NoteCardContent>
                <h3>{note.title}</h3>
                <p>{note.info}</p>
                <NoteCardMeta>
                  <p>{note.author}</p>
                  <p>{note.lastUpdated}</p>
                </NoteCardMeta>
              </NoteCardContent>
            </NoteCard>
          ))}
        </SideBar>
        <NoteMain>
          {selectedNote ? (
            <>
              <NoteHeader>
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
      </Bottom>
    </Wrap>
  );
}
export default Rooms;
