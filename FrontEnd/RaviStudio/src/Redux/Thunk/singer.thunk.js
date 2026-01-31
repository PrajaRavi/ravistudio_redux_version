import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// axios.defaults.withCredentials=true;
// Axios instance for API requests with cookies
const api = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true, // important for sending cookies
});
// `http://localhost:4500/singers?page=${page}&limit=${limit}`
export const FetchSinger = createAsyncThunk(
  "Singer/FetchSinger",
  async ({page,limit}, { rejectWithValue, dispatch }) => {
    try {
      let { data } = await api.get(`/singers?page=${page}&limit=${limit}`);
      console.log(data);
      return data;
    } catch (error) {
      return error.response.data.message
    }
  },
);
      

