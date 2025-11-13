import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Grid from "../components/dash-grid.jsx";
import CreateRoom from "../components/create-room.jsx";
const Wrapper = styled.div`
  min-height: 100vh;
`;
const Nav = styled.nav`
  background-color: white;
  justify-content: center;
  align-items: center;
  display: grid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  grid-template-columns: repeat(2, 1fr);

  h1 {
    background-image: linear-gradient(45deg, #fa5f5f, #8e7eff);
    color: transparent;
    background-clip: text;
    margin: 1rem;
    font-size: 26px;
  }
`;
const NavLink = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.$active ? "rgba(142, 126, 255, 0.1)" : "transparent"};
  color: ${(props) => (props.$active ? "#8e7eff" : "#6b7280")};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(142, 126, 255, 0.1);
    color: #8e7eff;
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
const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
`;
const Text = styled.h1`
  color: black;
  font-size: 26px;
  margin: 0 0 0.5rem 0;
`;
const S = styled.span`
  color: gray;
`;
const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 14px;
`;
function Dashboard() {
  const [toggle, setToggle] = useState(""); //might need to be All for default purposes
  const [errorMessage, setErrorMessage] = useState("");
  const [list, setList] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/room/list", {
      method: "GET",
      credentials: "include",
      // headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        console.log(response);
        if (response.status === 401 || response.status === 403) {
          window.location.replace("/login");
        } else if (response.status === 404) {
          setErrorMessage(response.message); //will need to change so a different action is performed when no lists are present
        } else if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          setErrorMessage(data.message);
        } else {
          console.log(data);
          setList(data);
        }
      });
  }, []);
  const handleDismiss = () => {
    setShowCreateRoom(false);
  };
  const handleRoomCreated = (newRoom) => {
    setList([...list, newRoom]);
    setShowCreateRoom(false);
  };
  const handleRoomError = (err) => {
    setErrorMessage(err);
  };
  return (
    <Wrapper>
      <Nav>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>Collab</h1>
          <NavLink $active={toggle === "All"} onClick={() => setToggle("All")}>
            All Rooms
          </NavLink>
          <NavLink
            $active={toggle === "Star"}
            onClick={() => setToggle("Star")}
          >
            Starred
          </NavLink>
          <NavLink
            $active={toggle === "Recent"}
            onClick={() => setToggle("Recent")}
          >
            Recent
          </NavLink>
        </div>
        <div style={{ position: "absolute", right: "2rem" }}>
          <Button onClick={() => setShowCreateRoom(true)}>
            <span>+ </span>New Room
          </Button>
        </div>
      </Nav>
      {showCreateRoom ? (
        <CreateRoom
          onCreate={handleRoomCreated}
          onDismiss={handleDismiss}
          onError={handleRoomError}
        />
      ) : (
        <Content>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Text>Your Rooms</Text>
          {list.length > 0 ? (
            <S>{list.length} Active Rooms</S>
          ) : (
            <S>Create Your first room!</S>
          )}
          {list.length > 0 ? <Grid rooms={list} /> : <></>}
        </Content>
      )}
    </Wrapper>
  );
}
export default Dashboard;
