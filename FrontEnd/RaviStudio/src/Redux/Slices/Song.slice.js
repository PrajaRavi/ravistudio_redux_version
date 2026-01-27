import { createSlice } from "@reduxjs/toolkit";
const initialState={
  SongArray:[],
  currsongidx:null,
  isPlaying:false,
  favouriteSongArray:[],
  FavouritePageOpenOrNot:false,
  UserShowSongOpenOrNot:false,
  SongDeletePopUp:false,
  UserPlaylist:[],
  userupdated:false, //koi fark nahi padta ye true hai ya false it is just telling that user profile is updated so that i can call the /user/me api to getuser again
  OpenDeletePlaylistPopUp:false,

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
    SetUpdatedUser:(state,action)=>{
      state.userupdated=action.payload
    },
    SetDeletePlaylistPopUp:(state,action)=>{
      state.OpenDeletePlaylistPopUp=action.payload
    }
  },
  extraReducers:(addBuilder) => {
      
    }


})
export const SongReducer=SongSlice.reducer;
export const {SetisPlaying,SetUserPlaylist,SetUpdatedUser,SetSongArray,SetCurrSongIdx,SetFavouriteSongArray,SetFavouirtePageOpenOrNot,SetDeletePlaylistPopUp} =SongSlice.actions