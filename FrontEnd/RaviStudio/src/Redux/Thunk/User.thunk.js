import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SetCurrUser, SetIsAdmin, SetLanguage } from "../Slices/User.slice";

// Axios instance for API requests with cookies
const api = axios.create({
  baseURL: "http://localhost:4500",
  withCredentials: true, // important for sending cookies
});

export const GetUser = createAsyncThunk(
  "user/GetUser",
  async (formdata, { rejectWithValue, dispatch }) => {
    try {
      let { data } = await api.get(`user/me`);
      console.log(data.data);
      dispatch(SetIsAdmin(data.data.isAdmin))
      dispatch(SetLanguage({code:data.data.language}))
      
      return data.data;
    } catch (error) {
      return error.response.data.message
    }
  },
);


