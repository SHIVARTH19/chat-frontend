import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import api from '../api'; // Axios instance with API key
import '../css/ChatScreen.css'; // Importing styles

const ChatScreen = () => {
    const [threads, setThreads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]); // List of all users
    const [searchQuery, setSearchQuery] = useState(''); // Search query
    const [showUserModal, setShowUserModal] = useState(false); // Show user modal
    const [selectedUser, setSelectedUser] = useState(null); // User selected for new chat
    const navigate = useNavigate(); // Hook for navigation
    const userId = parseInt(localStorage.getItem('userId'));

    const modalRef = useRef(null); // Ref for the modal container

    useEffect(() => {
        // Fetch the list of threads
        const fetchThreads = async () => {
            try {
                const { data } = await api.get(`/threads?userId=${userId}`);
                setThreads(data);
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchThreads();
    }, [userId]);

    useEffect(() => {
        // Fetch messages for the selected thread
        if (currentThreadId) {
            const fetchMessages = async () => {
                try {
                    const { data } = await api.get(`/messages?thread_id=${currentThreadId}`);
                    setMessages(data);
                    scrollToBottom(); // Scroll to bottom when messages are fetched
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();
        }
    }, [currentThreadId]);

    useEffect(() => {
        // Fetch all users
        const fetchUsers = async () => {
            try {
                const { data } = await api.get(`/users?userId=${userId}`);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle click outside of modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowUserModal(false);
            }
        };

        if (showUserModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserModal]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && currentThreadId) {
            try {
                await api.post('/messages', {
                    thread_id: currentThreadId,
                    sender_id: userId,
                    content: newMessage,
                });

                // Update local messages
                setMessages([...messages, { sender_id: userId, content: newMessage }]);
                setNewMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default form submission behavior
            handleSendMessage();
        }
    };

    const handleLogout = () => {
        // Clear local storage and redirect to login page
        localStorage.removeItem('userId');
        localStorage.removeItem('userNickname');
        window.location.href = '/login'; // Redirect to login page
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        setShowUserModal(false);

        // Check if a thread already exists between the current user and the selected user
        try {
            const { data } = await api.post('/threads', {
                receiver_id: user.id,
                sender_id: userId
            });
            if (data.existing) {
                setCurrentThreadId(data.thread.id); // Set the existing thread as current
            } else {
                setThreads([...threads, data.thread]); // Add new thread to the list
                setCurrentThreadId(data.thread.id); // Set the new thread as current
            }
        } catch (error) {
            console.error('Error creating new thread:', error);
        }
    };

    const filteredUsers = users.filter(user =>
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.messages-list');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0'); // Add leading zero if needed
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Add leading zero if needed
        const seconds = date.getSeconds().toString().padStart(2, '0'); // Add leading zero if needed
        
        return `${hours}:${minutes}`;
    };

    return (
        <div className="chat-container">
            {/* Header section with Logout Button */}
            <div className="header">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            {/* Main content area */}
            <div className="main-content">
                {/* Threads List */}
                <div className="threads-list">
                    <button onClick={() => setShowUserModal(true)} className="new-chat-button">
                        New Chat
                    </button>
                    <h2>Threads</h2>
                    {threads.length > 0 ? (
                        threads.map((thread) => (
                            <div
                                key={thread.id}
                                onClick={() => setCurrentThreadId(thread.id)}
                                className={`thread-item ${currentThreadId === thread.id ? 'active' : ''}`}
                            >
                                {userId === thread.receiver_id ? thread.sender.nickname : thread.receiver.nickname}
                            </div>
                        ))
                    ) : (
                        <p>No threads available</p>
                    )}
                </div>

                {/* Messages Display */}
                <div className="chat-box">
                    <h2>Messages</h2>
                    {currentThreadId ? (
                        <>
                            <div className="messages-list">
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`message ${msg.sender_id === userId ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                {msg.content}
                                                <span className="message-time">{formatTime(msg.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages yet</p>
                                )}
                            </div>
                            <div className="message-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type a message"
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <p>Select a thread to view messages</p>
                    )}
                </div>
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="user-modal">
                    <div className="modal-content" ref={modalRef}>
                        <span className="close-button" onClick={() => setShowUserModal(false)}>&times;</span>
                        <h2>Select a User</h2>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <ul className="user-list">
                            {filteredUsers.map(user => (
                                <li key={user.id} onClick={() => handleUserSelect(user)} className="user-item">
                                    {user.nickname}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatScreen;
