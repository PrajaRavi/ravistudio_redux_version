import express from "express"
import {  addSongToMultiplePlaylists, getAllPlaylist, GetPlaylistById, GetUserPlaylistById, GetUserPlaylistSongs,  } from "../Controllers/playlist.controller.js";
export const PlaylistRouter=express.Router();
import {protect} from "../Middlewares/Toke.auth.js"

PlaylistRouter.get("/get-all-playlist", getAllPlaylist);
PlaylistRouter.get("/get-playlist-by-id/:id", GetPlaylistById);
PlaylistRouter.get("/get-user-playlist-by-id/:id",protect, GetUserPlaylistById);
PlaylistRouter.get("/get-user-playlist-song-by-id/:id",protect,GetUserPlaylistSongs);
PlaylistRouter.post("/post-user-playlist-song-by-userplaylistid/",protect,addSongToMultiplePlaylists);

