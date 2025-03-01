import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp.jsx";
import ChatPage from "./components/ChatPage";
import CallSystem from "./components/CallSystem.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <ChatPage />

            ) : (
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            )
          }
        />

        {/* <Route
          path="room/:roomID"
          element={
            isLoggedIn ? (
              <CallSystem />

            ) : (
              <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            )
          }
        /> */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;