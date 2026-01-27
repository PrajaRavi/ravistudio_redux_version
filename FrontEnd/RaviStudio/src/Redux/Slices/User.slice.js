import { createSlice } from "@reduxjs/toolkit";
import {  GetUser, SignUpUser } from "../Thunk/User.thunk";

const initialState = {
  CurrUser: null,
  IsUserLogin: false,
  IsAdmin: false,
  signuploading: false,
  signindata: null,
  GetUserLoading: false,
  getusererror:null,
  error: null,
  language: { code: "en" },
};
const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    SetLanguage: (state, action) => {
      state.language = action.payload;
      
    },
    SetLogin: (state, action) => {
      state.IsUserLogin = action.payload;
    },
    SetCurrUser: (state, action) => {
      state.CurrUser=null
      state.CurrUser = action.payload;
    },
    SetIsAdmin:(state, action) => {
      state.IsAdmin=action.payload
    },
    
  },
  extraReducers: (addBuilder) => {
    addBuilder.addCase(SignUpUser.pending, (state, action) => {
      state.signuploading = true;
      state.error = null;
      state.CurrUser = null;
    });
    addBuilder.addCase(SignUpUser.fulfilled, (state, action) => {
      
      state.signuploading = false;
      state.error = null;
      state.CurrUser = action.payload;

    });
    addBuilder.addCase(SignUpUser.rejected, (state, action) => {
      console.log(action)
      state.signuploading = false;
      state.error = action.payload;
    });

    addBuilder.addCase(GetUser.pending, (state, action) => {
      state.GetUserLoading = true;
      state.error = null;
      state.language=null;
      state.CurrUser = null;
    });
    addBuilder.addCase(GetUser.fulfilled, (state, action) => {
      
      state.GetUserLoading = false;
      state.error = null;
      state.CurrUser = action.payload;
      
    });
    addBuilder.addCase(GetUser.rejected, (state, action) => {
      console.log(action)
      state.GetUserLoading = false;
      state.error = action.payload;
    });

  
  },
});
export const { SetLanguage, SetLogin, SetCurrUser, Setsignindata,SetIsAdmin } =
  UserSlice.actions;
export const UserReducer = UserSlice.reducer;
