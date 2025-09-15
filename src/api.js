import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login/`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createUser = async (userData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/`, userData, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userId, userData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
