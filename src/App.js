// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';

const App = () => {
    const isLoggedIn = !!localStorage.getItem('userNickname');

    return (
        <Router>
            <Routes>
            <Route path="/" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} />
                <Route path="/login" element={isLoggedIn ? <Navigate to="/chat" /> : <LoginScreen />} />
                <Route path="/chat" element={!isLoggedIn ? <Navigate to="/login" /> : <ChatScreen />} />
            </Routes>
        </Router>
    );
};

export default App;
