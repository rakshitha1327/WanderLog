import axios from "axios";
import BASE_URL from "../config";

export const loginUser = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${BASE_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
};
