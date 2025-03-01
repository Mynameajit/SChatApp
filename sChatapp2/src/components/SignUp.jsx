import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if the current user is an admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid !== "gIbb20IJ3jNRSDJIymqSr5BP6Ny2") {
        // Redirect non-admin users to the login page
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        uid: user.uid,
      });

      alert("Sign up successful! Please login.");
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: "300px",
          textAlign: "center",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignUp}
          sx={{ marginTop: 2 }}
        >
          Sign Up
        </Button>
        <Typography sx={{ marginTop: 2 }}>
          Already have an account? <Link to="/">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;