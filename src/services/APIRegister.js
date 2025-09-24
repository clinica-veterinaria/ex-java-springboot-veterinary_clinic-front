import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; 

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
            'Content-Type': 'multipart/form-data' 
        }
    });
    return response.data;
};