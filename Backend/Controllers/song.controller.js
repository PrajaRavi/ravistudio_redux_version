import { SongModel } from "../Models/song.model.js";

export const GetAllSongs=async (req,res)=>{
  try {
    let data=await SongModel.find()
    if(!data) return;
    return res.send({success:true,msg:data})
  } catch (error) {
    return res.send({success:false,msg:"song fetch failed"})
  }
}