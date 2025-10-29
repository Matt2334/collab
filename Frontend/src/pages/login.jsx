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
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to log in");
      }
      window.location.replace("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Wrapper>
      <div>
        <h1>Welcome back</h1>
        <p>Sign in to your workspace and start collaborating</p>
        <SignIn>
          <h3>Sign In</h3>
          <p>Enter your credentials to access your account</p>
          <form onSubmit={handleSubmit}>
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
        <P>Don't have an account yet? <a href="/signup" >Sign up</a></P>
      </div>
    </Wrapper>
  );
}
export default Login;
