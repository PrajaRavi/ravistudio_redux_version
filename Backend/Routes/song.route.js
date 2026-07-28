import express from "express"
import { GetAllSongs, getFavouriteSongs, GetRecommendSongDetail, GetSongBySimilirtySearch, removeFromFavourite, StoreUserId,} from "../Controllers/song.controller.js";
import {protect, protectforapp} from "../Middlewares/Toke.auth.js"
export const SongRouter=express.Router();

SongRouter.get("/get-all-songs",GetAllSongs);
SongRouter.post("/get-song-by-similiraty-search",GetSongBySimilirtySearch);
// SongRouter.post("/updated-last-played-song",protect,UpdateLastPlayedSong);
// SongRouter.get("/get-last-played-song",protect,GetLastPlayedSong); //this route will extract the lastplayed song in the whole songs collection

SongRouter.post("/Store-user-Id/:songId",protect,StoreUserId);
SongRouter.post("/get-recom-song-detail",protect,GetRecommendSongDetail);
SongRouter.get("/GetAllFavouriteSong",protect,getFavouriteSongs);
SongRouter.get("/GetAllFavouriteSong-for-app",protectforapp,getFavouriteSongs);
SongRouter.delete("/DeleteSongFromBothSection/:songId",protect,removeFromFavourite); //this controller will basically delete song from user also and it delete the user from song likedBy object also
SongRouter.delete("/DeleteSongFromBothSection-for-app/:songId",protectforapp,removeFromFavourite); //this controller will basically delete song from user also and it delete the user from song likedBy object also
