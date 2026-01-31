import { configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "../Slices/User.slice";
import { SongReducer } from "../Slices/Song.slice";
import { AdminReducer } from "../Slices/Admin.slice";
import { SingerReducer } from "../Slices/singer.slice";

export const store = configureStore({
  reducer: {
    User: UserReducer,
    Song:SongReducer,
    Admin:AdminReducer,
    Singer:SingerReducer
  },
});
