import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Dashboard from "./pages/dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
