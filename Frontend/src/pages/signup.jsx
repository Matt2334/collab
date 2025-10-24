import React, { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100vh;
`;
const SignIn = styled.div`
  margin: auto;
  text-align: left;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 1rem 3rem;
  border-radius: 0.7rem;
  width: 30vw;
  form {
    display: flex;
    flex-direction: column;
    font-size: 13px;
  }
`;
const Input = styled.input`
  padding: 0.5rem 1rem;
  outline: none;
  // border-radius: 1rem;
  border-radius: 0.5rem;
  border: none;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  background-color: #e0e0e0;
`;
const B = styled.button`
  background-color: purple;
  // background-color: #af61af;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 0.5rem;
  font-size: 14px;
  margin-bottom: 1rem;
  cursor: pointer;
`;
const P = styled.p`
  color: gray;
  font-size: 14px;
  a{
    color: #af61af;
    text-decoration: none;
  }
`
function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }
      window.location("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <Wrapper>
      <div>
        <h1>Create Your Account</h1>
        <p>Start collaborating with your team in real-time</p>
        <SignIn>
          <h3>Create Account</h3>
          <p>Fill in your details to get started</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <Input
              id="name"
              type=""
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="text"
              placeholder="........"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <B type="submit">Sign In</B>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </SignIn>
        <P>Already have an account? <a href="/login" >Login</a></P>
      </div>
    </Wrapper>
  );
}
export default SignUp;
