import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";
const Wrap = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 1rem;
  a {
    text-decoration: none;
  }
`;

const Container = styled.div`
  padding: 1rem;
  text-align: left;
  background-color: white;
  border-radius: 1rem;
  border: 1px solid oklch(0.92 0.01 280);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  top: 0;
  transition: transform 0.3s ease-in-out;
  &:hover {
    h3 {
      color: oklch(0.65 0.25 280);
    }
    border: 1px solid oklch(0.65 0.25 280);
    transform: translateY(-3%);
    box-shadow:
  0 20px 25px -5px rgba(142, 126, 255, 0.15),
  0 8px 10px -6px rgba(142, 126, 255, 0.12);

`;
const Title = styled.h3`
  font-size: 18px;
  color: oklch(0.25 0.02 280);
  margin-top: 0.5rem;
`;
const Text = styled.span`
  color: oklch(0.55 0.02 280);
  font-size: 14px;
  margin-right: 0.5rem;
`;

const Content = styled.div`
  margin-top: 1rem;
  div {
    display: flex;
  }
  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.2rem;
  }
`;
function Grid({ rooms }) {
  return (
    <Wrap>
      
      {rooms.map((room) => (
        <Link to={`/rooms/${room.id}`} key={room.id}>
          <Container>
            <Title>{room.name}</Title>
            <Text>{room.desc}</Text>
            <Content>
              <div>
                <Text>
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
                  {room.memberCount}
                </Text>
                <Text>
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
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  {room.noteCount}
                </Text>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <Text>{room.author}</Text>
                <Text>
                  {/* {room.author} */}
                  {/* <svg
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg> */}
                  {/* {room.lastActive} */}
                  x time ago.
                </Text>
              </div>
            </Content>
          </Container>
        </Link>
      ))}
    </Wrap>
  );
}
export default Grid;
