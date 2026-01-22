import { createSlice } from "@reduxjs/toolkit";
const initialState={
  songid:null,
  artist:"hello sir ji",
  songname:null,
  cover:null,
  idx:null,
  totalsong:null,
  MasterFileUrl:"http://localhost:4500/hls-output/1769016309072-Martin_Bravi_Needed_You.mp3/index.m3u8",
  isPlaying:false,
}
const SongSlice=createSlice({
  initialState,
  name:"Song",
  reducers:{
    SaveSong:(state,action)=>{
      state.artist=action.payload.artist
      state.songname=action.payload.songname
      state.cover=action.payload.cover
      state.idx=action.payload.idx
      state.totalsong=action.payload.totalsong
      state.MasterFileUrl=action.payload.MasterFileUrl
      state.songid=action.payload.songid
      
      
    },
    SetisPlaying:(state,action)=>{
      state.isPlaying=action.payload
    }
  },
  extraReducers:(addBuilder) => {
      
    }


})
export const SongReducer=SongSlice.reducer;
export const {SaveSong,SetisPlaying} =SongSlice.actions