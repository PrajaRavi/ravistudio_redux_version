import { createSlice } from "@reduxjs/toolkit";
const initialState={
  UserPlaylistData:[],
}
const PlaylistSlice=createSlice({
  initialState,
  name:"Playlist",
  reducers:{
    
    SetUserPlaylistData:(state,action)=>{
      state.UserPlaylistData=action.payload
    },
    
  },
  extraReducers:(addBuilder) => {
      
    }


})
export const PlaylistReducer=PlaylistSlice.reducer;
