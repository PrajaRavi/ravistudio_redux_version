
import mongoose from "mongoose";
const playlistschema=new mongoose.Schema({
  name:{
    type:String,

  },

  playlistimage:{
    type:String,
  },
  title:{
    type:String,
  },
  descreption:{
    type:String,
  }

})
export const PlaylistModel=mongoose.model("Playlist",playlistschema)