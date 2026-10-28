import {createSlice} from "@reduxjs/toolkit"
import { FetchSinger } from "../Thunk/singer.thunk";
const initialState={
  list: [],
  loading: false,
  page:1,
  TotalPages:2,
  error:null,

}
const SingerSlice=createSlice({
  name:"Singer",
  initialState,
  reducers:{
    SetPages:(state,action)=>{
      state.page=action.payload
    }

    

  },
  extraReducers:(addBuilder) => {
      addBuilder.addCase(FetchSinger.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.CurrUser = null;
      });
      addBuilder.addCase(FetchSinger.fulfilled, (state, action) => {
        console.log(action.payload)
        state.list = action.payload.singers;
        state.error = null;
        state.page = action.payload.page;
        state.TotalPages = action.payload.totalPages;
  
      });
      addBuilder.addCase(FetchSinger.rejected, (state, action) => {
        
        state.loading = false;
        state.error = action.payload;
      });
    }
})
export const SingerReducer=SingerSlice.reducer;
export const {SetPages} =SingerSlice.actions