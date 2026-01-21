import { createSlice } from "@reduxjs/toolkit";
const initialState={
  SingerData:[],
  SingerDataLoading:null,
  Singererror:null,
}
const SongSlice=createSlice({
  initialState,
  name:"Song",
  reducers:{

  },
  extraReducers:(addBuilder) => {
      
    }


})
export const SongReducer=SongSlice.reducer;