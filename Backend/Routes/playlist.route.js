import express from "express"
import { getAllPlaylist, GetPlaylistById } from "../Controllers/playlist.controller.js";
export const PlaylistRouter=express.Router();

PlaylistRouter.get("/get-all-playlist", getAllPlaylist);
PlaylistRouter.get("/get-playlist-by-id/:id", GetPlaylistById);
