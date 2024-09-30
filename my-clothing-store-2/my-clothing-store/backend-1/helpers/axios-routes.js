
const axios=require('axios');
const API_URL = 'http://localhost:9000/api'; // Replace with your actual backend URL



export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData); // Adjust endpoint as needed
        return response.data; // Return the response data (the created user)
    } catch (error) {
        throw error.response ? error.response.data : error.message; // Handle errors gracefully
    }
}
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, userData); // Adjust endpoint as needed
        return response.data; // Return the response data (the created user)
    } catch (error) {
        throw error.response ? error.response.data : error.message; // Handle errors gracefully
    }
}