// src/api.js
import axios from 'axios';

// Replace with your actual API endpoint and API key
const API_BASE_URL = 'http://127.0.0.1:8000/api/';
const API_KEY = 'your-api-key-here';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});

export default api;
