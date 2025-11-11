import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EditNote from "../components/edit-note";
import { io } from "socket.io-client";

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
    .trash {
      display: block;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    color: oklch(0.55 0.02 280);
    flex-shrink: 0;
    margin-top: 2px;
  }
  .trash {
    display: none;
    stroke: #e37878;
  }
  button {
    border: none;
    background: inherit;
    cursor: pointer;
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
const ErrorMessage = styled.div`
  margin: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #991b1b;
  font-size: 14px;
`;
const Search = styled.div`
  margin: 1rem;
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 100;
    }
  }
`;
const Button = styled.button`
  background-color: rgba(142, 126, 255, 1);
  color: white;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  padding: 0.7rem 1.5rem;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(142, 126, 255, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(142, 126, 255, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

function Rooms() {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [m, setM] = useState("");

  // Socket.io
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: true,
    });
    newSocket.on("connection", () => {
      console.log("Connected", newSocket.id);
      setIsConnected(true);
    });
    newSocket.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
    });
    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    if (socket && id) {
      console.log("Joining Room: ", id);
      socket.emit("join-room", parseInt(id));
      return () => {
        console.log("Leaving Room: ", id);
        socket.emit("leave-room", parseInt(id));
      };
    }
  }, [socket, id]);

  // Listen to Socket
  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on(
      "note-updated",
      ({ noteId, content, title, updatedBy, timestamp }) => {
        console.log("Note updated by: ", updatedBy);
        console.log(noteId, content, title, updatedBy, timestamp);
        setNotes(
          notes.map((note) =>
            note.id === noteId
              ? { noteId, content, title, updatedBy, timestamp }
              : note
          )
        );
      }
    );
    return () => {
      // socket.off("note-created");
      socket.off("note-updated");
      // socket.off("note-deleted");
      // socket.off("user-editing-note");
      // socket.off("user-stopped-editing");
    };
  }, [socket, selectedNoteId]);

  // fetch room's notes
  useEffect(() => {
    fetch(`http://localhost:3000/api/note/${id}/notes`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 403 || response.status === 401) {
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
          setNotes(data);

          if (data.length > 0 && !selectedNoteId) {
            setSelectedNoteId(data[0].id);
          }
        }
      });
  }, [id]);
  const handleCreateNote = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/note/${id}/notes`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const newNote = await response.json();
      console.log(newNote);
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  // const handleNoteUpdated = (updatedNote) => {
  //   setNotes(
  //     notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
  //   );
  // };
  const handleNoteDelete = async (noteID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/note/${id}/notes/${noteID}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      const updatedNotes = notes.filter((note) => note.id !== noteID);
      setNotes(updatedNotes);

      if (selectedNoteId === noteID) {
        setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </BackButton>
        </div>
        <Title>
          {/* need to fix since if there are no notes, it wont come up with the name */}
          {/* need to fix room description at the same time. We can make an API call if desired */}
          <h1>{notes[0]?.room?.name || "Loading room..."}</h1>
          <h2>{notes[0]?.room?.desc || "Loading description..."}</h2>
          {/* {console.log(notes[0]?.room?.desc)} */}
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
          <Search>
            <div>
              <h3>Notes</h3>
              {/* onClick might need ()=> handleCreateNote */}
              <Button onClick={handleCreateNote}>+ New Note</Button>
            </div>
          </Search>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              $active={selectedNoteId === note.id}
              onClick={() => setSelectedNoteId(note.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                <path d="M10 9H8"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
              </svg>
              <NoteCardContent>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <NoteCardMeta>
                  <p>{note.author}</p>
                  <p>{note.lastUpdated}</p>
                </NoteCardMeta>
              </NoteCardContent>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="trash"
                onClick={() => handleNoteDelete(note.id)}
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </NoteCard>
          ))}
        </SideBar>
        <EditNote
          roomID={id}
          noteID={selectedNoteId}
          // onNoteUpdated={handleNoteUpdated}
          socket={socket}
        />
      </Bottom>
    </Wrap>
  );
}
export default Rooms;
