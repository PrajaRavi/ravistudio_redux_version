import { response } from "express";
import { SongModel } from "../Models/song.model.js";
import {UserModel} from "../Models/User.model.js"
import {ObjectId} from "mongodb";
export const GetAllSongs=async (req,res)=>{
  try {
    let data=await SongModel.find()
    if(!data) return;
    return res.send({success:true,msg:data})
  } catch (error) {
    return res.send({success:false,msg:"song fetch failed"})
  }
}
export const StoreUserId=async (req,res)=>{
  const userId = req.user.id;       // from protect middleware
  const songId=req.params.songId;
    
  try {
    let data=await SongModel.findByIdAndUpdate(
      songId,
      {
        $addToSet: { likedBy: userId }, // 👈 NO DUPLICATES
      },
      { new: true }
    );
    if(!data) return;
    return res.send({success:true,msg:"User added succesfully"})
  } catch (error) {
    console.log(error)
    return res.send({success:false,msg:"userid post failed in song"})
  }
}

export const getFavouriteSongs = async (req, res, next) => {
  try {
    const userId = req.user.id; // from protect middleware

    const user = await UserModel.findById(userId)
      .select("favoriteSongs")
      .lean();

    if (!user || !user.favoriteSongs.length) {
      return res.status(200).json({
        success: true,
        songs: [],
      });
    }

    const songs = await SongModel.find({
      _id: { $in: user.favoriteSongs },
    });

    res.status(200).json({
      success: true,
      songs,
    });
  } catch (error) {
    console.log(error)
    return res.send({success:false,msg:error});
  }
};

export const removeFromFavourite = async (req, res) => {
  try {
    const userId = req.user.id;      // from protect middleware
    const songId  = req.params.songId;
    console.log(songId)
    // remove song from user's favourites
    let  data=await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { favoriteSongs: ObjectId.createFromHexString(songId) } }
    );

    // remove user from song's likedBy
    let data1=await SongModel.findByIdAndUpdate(
      songId,
      { $pull: { likedBy: ObjectId.createFromHexString(userId) } }
    );
    res.status(200).json({
      success: true,
      msg: "Song removed from favourites",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      msg: "Failed to remove favourite",
    });
  }
};
