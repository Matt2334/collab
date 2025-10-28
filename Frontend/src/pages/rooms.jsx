import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
const Wrap = styled.div`
  background-color: white;
  height: 100vh;
`;
const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding-left: 1rem;
  border-bottom: 2px solid oklch(0.92 0.01 280);
`;
const Button = styled.button`
  background-color: oklch(0.98 0.01 280);
  border: 1px solid oklch(0.92 0.01 280);
  border-radius: 0.7rem;
  cursor: pointer;
  padding: 0.4rem 1rem;
  align-items: center;
  display: flex;
  color: oklch(0.25 0.02 280);
  position: absolute;
  right: 2rem;
  top: 1.5rem;
  svg {
    width: 1rem;
    height: 1rem;
    padding-right: 0.5rem;
  }
`;
const Title = styled.div`
  font-weight: 100;
  h1 {
    font-size: 20px;
    color: oklch(0.25 0.02 280);
  }
  h2 {
    font-size: 14px;
    color: oklch(0.55 0.02 280);
  }
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: columns;
`;
const SmallNote = styled.div`
  width: 40vw;
  display: flex;
  flex-direction: row;
  align-items: start;
  padding: 1rem;
  gap: 0.5rem;
  svg {
    width: 1rem;
    height: 1rem;
    color: oklch(0.55 0.02 280);
    overflow: unset;
  }
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
    width: 60%;
    margin: 0 0 0.5rem 0;
  }
`;
const NoteMain = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgb(247 248 255);
  border-left: 1px solid oklch(0.92 0.01 280);
  font-size: 14px;
  div {
    width: 100%;
    margin: 1rem;
    h3{
        font-weight: 100;
        font-size: 14px;
    }
  }
  textarea{
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: inherit;
    outline: none;
    border: none;
    border-top: 1px solid oklch(0.92 0.01 280);
    
  }  
`;
function Rooms() {
  const [roomInfo, setRoomInfo] = useState([]);
  const [m, setM] = useState("");
  const { id } = useParams();
  const [toggle, setToggle] = useState(0);
  useEffect(() => {
    fetch(`http://localhost:5000/api/note/${id}/notes`, {
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
  });
  const mockNotes = [
    {
      id: 1,
      title: "Feature Requirements",
      info: "Core features for the Q1 release including user authentication, real-time collaboration, and workspace management.",
      author: "Alice Johnson",
      lastUpdated: "2 hours ago",
    },
  ];
  return (
    <Wrap>
      <Top>
        <div>
          <Link to="/dashboard">
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
          </Link>
        </div>
        <Title>
          <h1>Product Planning</h1>
          <h2>Q1 2025 roadmap and feature specs</h2>
        </Title>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button>
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
          </Button>
        </div>
      </Top>
      <Bottom>
        <div>
          {mockNotes.map((note) => (
            <SmallNote onClick={() => setToggle(note.id)} key={note.id}>
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
              <div>
                <h3>{note.title}</h3>
                <p>{note.info}</p>
                <div style={{ display: "flex", width: "40%" }}>
                  <p>{note.author}</p>
                  <p>{note.lastUpdated}</p>
                </div>
              </div>
            </SmallNote>
          ))}
        </div>
        <NoteMain>
          <div>
            <h3>{mockNotes[toggle].title}</h3>
            {/* will need to chnage h3 to an input style so title can be editable */}
          </div>
          <textarea />
        </NoteMain>
      </Bottom>
    </Wrap>
  );
}
export default Rooms;
