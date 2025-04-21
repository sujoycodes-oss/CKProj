import axios from "axios";

export const API_URL = "http://localhost:8080/auth";

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message);
    }
};
