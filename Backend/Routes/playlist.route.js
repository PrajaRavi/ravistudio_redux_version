import express from "express"
import { getAllPlaylist } from "../Controllers/playlist.controller.js";
export const PlaylistRouter=express.Router();

PlaylistRouter.get("/get-all-playlist", getAllPlaylist);
