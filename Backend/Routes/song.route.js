import express from "express"
import { GetAllSongs } from "../Controllers/song.controller.js";
export const SongRouter=express.Router();

SongRouter.get("/get-all-songs",GetAllSongs);
