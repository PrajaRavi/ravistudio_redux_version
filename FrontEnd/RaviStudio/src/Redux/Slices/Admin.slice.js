// This page will contain all  the state related with admin panel
import {createSlice} from "@reduxjs/toolkit"
const initialState={
UserDetail:[],
UserApiPage:1,
UserApiCalled:false,
}
const AdminSlice=createSlice({
  initialState,
  name:"Admin",
  reducers:{
    SetUserDetail:(state,action)=>{
      state.UserDetail=action.payload
    },
    SetUserApiPage:(state,action)=>{
      state.UserApiPage=action.payload
    },
    SetUserApiCalled:(state,action)=>{
      state.UserApiCalled=action.payload
    },

  }
})
export const AdminReducer =AdminSlice.reducer;
