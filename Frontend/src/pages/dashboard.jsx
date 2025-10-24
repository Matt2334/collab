import React from "react";
import styled from "styled-components";
const Wrapper = styled.div``;
const A = styled.a``;
function Dashboard() {
  return (
    <Wrapper>
      <nav>
        <A>All Rooms</A>
        <A>Starred</A>
        <A>Recent</A>
        <Button><span>+</span>New Room</Button>
        
        </nav>
      <div></div>
    </Wrapper>
  );
}
export default Dashboard;
