import { createSlice } from "@reduxjs/toolkit";
const initialState={
  SongArray:[],
  currsongidx:0,
  isPlaying:false,
  favouriteSongArray:[],
  FavouritePageOpenOrNot:false,
  UserShowSongOpenOrNot:false,
  SongDeletePopUp:false,
  UserPlaylist:[]

}
const SongSlice=createSlice({
  initialState,
  name:"Song",
  reducers:{
    
    SetisPlaying:(state,action)=>{
      state.isPlaying=action.payload
    },
    SetSongArray:(state,action)=>{
      state.SongArray=action.payload
      console.log(action.payload)
      console.log("songarray")
    },
    SetCurrSongIdx:(state,action)=>{
      state.currsongidx=action.payload
    },
    SetFavouriteSongArray:(state,action)=>{
      state.favouriteSongArray=action.payload
    },
    SetFavouirtePageOpenOrNot:(state,action)=>{
      state.FavouritePageOpenOrNot=action.payload
    },
    SetUserPlaylist:(state,action)=>{
      state.UserPlaylist=action.payload
      console.log(action.payload)
      console.log("user playlist slice")

    },
  },
  extraReducers:(addBuilder) => {
      
    }


})
export const SongReducer=SongSlice.reducer;
export const {SetisPlaying,SetUserPlaylist,SetSongArray,SetCurrSongIdx,SetFavouriteSongArray,SetFavouirtePageOpenOrNot} =SongSlice.actions