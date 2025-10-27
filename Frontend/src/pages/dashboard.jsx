import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Grid from "../components/dash-grid.jsx";
const Wrapper = styled.div``;
const Nav = styled.nav`
  background-color: white;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  h1 {
    background-image: linear-gradient(45deg, #fa5f5f, #8e7eff);
    color: transparent;
    background-clip: text;
    margin: 1rem;
    font-size: 26px;
  }
`;
const A = styled.a`
  padding: 1rem;
  text-decoration: none;
  color: #a19e9e;
  font-size: 14px;
  cursor: pointer;
`;
const Button = styled.button`
  background-color: rgba(142, 126, 255, 1);
  color: white;
  border: none;
  border-radius: 0.7rem;
  cursor: pointer;
  padding: 0.6rem 1.5rem;
`;
const Content = styled.div`
  margin: 1rem;
`;
const Text = styled.h1`
  color: black;
  font-size: 26px;
  margin: 0 0 0.5rem 0;
`;
const S = styled.span`
  color: gray;
`;
function Dashboard() {
  const mockRooms = [
    {
      id: "1",
      name: "Product Planning",
      description: "Q1 2025 roadmap and feature specs",
      members: 5,
      lastActive: "2 hours ago",
      noteCount: 12,
    },
    {
      id: "2",
      name: "Design System",
      description: "Component library and design tokens",
      members: 3,
      lastActive: "5 hours ago",
      noteCount: 8,
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Launch strategy and content calendar",
      members: 7,
      lastActive: "1 day ago",
      noteCount: 15,
    },
    {
      id: "4",
      name: "Engineering Docs",
      description: "Architecture decisions and API specs",
      members: 4,
      lastActive: "3 hours ago",
      noteCount: 20,
    },
    {
      id: "5",
      name: "Customer Research",
      description: "User interviews and feedback analysis",
      members: 6,
      lastActive: "4 hours ago",
      noteCount: 10,
    },
    {
      id: "6",
      name: "Sprint Planning",
      description: "Weekly sprint goals and retrospectives",
      members: 8,
      lastActive: "30 minutes ago",
      noteCount: 6,
    },
  ];
  const [toggle, setToggle] = useState(""); //might need to be All for default purposes
  const [m, setM] = useState("");
  const [list, setList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/room/list", {
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
          setList(data);
        }
      });
  });
  return (
    <Wrapper>
      <Nav>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>Collab</h1>
          <A onClick={() => setToggle("All")}>All Rooms</A>
          <A onClick={() => setToggle("Star")}>Starred</A>
          <A onClick={() => setToggle("Recent")}>Recent</A>
        </div>
        <div style={{ position: "absolute", right: "2rem" }}>
          <Button>
            <span>+ </span>New Room
          </Button>
        </div>
      </Nav>
      <Content>
        <Text>Your Rooms</Text>
        <S>{mockRooms.length} Active Rooms</S>
        <Grid rooms={mockRooms} />
      </Content>
    </Wrapper>
  );
}
export default Dashboard;
