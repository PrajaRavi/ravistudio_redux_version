import { configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "../Slices/User.slice";
import { SongReducer } from "../Slices/Song.slice";

export const store = configureStore({
  reducer: {
    User: UserReducer,
    Song:SongReducer,
  },
});
