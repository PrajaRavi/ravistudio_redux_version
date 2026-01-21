import { SongModel } from "../Models/song.model";

export const PostSong=async (req,res,next)=>{
  const {title,artist,album,genre,year,language,track,duration,coverImage}=req.body;
  try {
    let data=await SongModel.create({title,artist,album,genre,year,language,track,duration,coverImage})
      data.save()
  } catch (error) {
    return res.send({success:false,msg:error})
  }
}