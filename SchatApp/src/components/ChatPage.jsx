import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { TextField, Button, Typography, Box, Paper, AppBar, Toolbar, Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        await addDoc(collection(db, "messages"), {
          text: newMessage,
          sender: auth.currentUser.uid,
          senderName: auth.currentUser.displayName || "Anonymous",
          timestamp: serverTimestamp(),
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  // Delete all messages
  const deleteAllMessages = async () => {
    try {
      const batch = writeBatch(db);
      messages.forEach((msg) => {
        const messageRef = doc(db, "messages", msg.id);
        batch.delete(messageRef);
      });
      await batch.commit();
      alert("All messages deleted successfully!");
    } catch (error) {
      console.error("Error deleting messages: ", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f0f2f5" }}>
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#007bff", color: "#ffffff" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SChat App
          </Typography>

          {!auth.currentUser?.uid === "gIbb20IJ3jNRSDJIymqSr5BP6Ny2" ?(
             <Typography variant="body1" sx={{ marginRight: "center" }}>
             {auth.currentUser?.email || "Ak"}
           </Typography>
          ):""
        }

         

          <Avatar sx={{ backgroundColor: "#ffffff", color: "#007bff", marginRight: 2 }}>
            {auth.currentUser?.email?.charAt(0) || "A"}
          </Avatar>
          {/* Delete All Messages Button (Conditional) */}
          {auth.currentUser?.uid === "gIbb20IJ3jNRSDJIymqSr5BP6Ny2" && (
            <IconButton color="inherit" onClick={deleteAllMessages}>
              <DeleteIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Chat Messages */}
      <Box sx={{ flex: 1, padding: 2, overflowY: "auto" }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.sender === auth.currentUser.uid ? "flex-end" : "flex-start",
              marginBottom: 2,
            }}
          >
            <Paper
              sx={{
                padding: 2,
                backgroundColor: msg.sender === auth.currentUser.uid ? "#007bff" : "#e0e0e0",
                color: msg.sender === auth.currentUser.uid ? "#ffffff" : "#000000",
                borderRadius: 2,
                maxWidth: "70%",
              }}
            >
             
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" sx={{ display: "block", textAlign: "right" }}>
                {msg.timestamp?.toDate().toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input Box */}
      <Box sx={{ padding: 2, backgroundColor: "#ffffff" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
          size="small"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button size="small" variant="contained" color="primary" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;