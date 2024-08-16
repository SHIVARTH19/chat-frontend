// src/components/LoginScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import '../css/LoginScreen.css'; // Importing styles

const LoginScreen = () => {
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState(null); // For displaying errors
    const navigate = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            handleLogin();
        }
    };

    const handleLogin = async () => {
        if (nickname.trim()) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/login', { nickname });

                if (response.status === 200) {
                    console.log(response.status);
                    const { id, nickname } = response.data; // Assuming response contains userId and token
                    localStorage.setItem('userId', id);
                    localStorage.setItem('userNickname', nickname);
                    window.location.href = '/chat'; // Redirect to chat page
                } else {
                    setError('Login failed. Please try again.'); // Handle errors based on response
                }
            } catch (error) {
                console.error('Login error:', error);
                setError('An error occurred during login. Please try again.'); // Handle network or server errors
            }
        } else {
            setError('Nickname cannot be empty.');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={handleKeyPress}
                className="nickname-input"
            />
            <button onClick={handleLogin} className="login-button">Start Chat</button>
            {error && <p className="error-message">{error}</p>} {/* Display errors */}
        </div>
    );
};

export default LoginScreen;
