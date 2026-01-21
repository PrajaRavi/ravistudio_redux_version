import {PlaylistModel} from "../Models/Playlist.model.js"
export const getAllPlaylist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalSingers = await PlaylistModel.countDocuments();

    const singers = await PlaylistModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total: totalSingers,
      page,
      totalPages: Math.ceil(totalSingers / limit),
      singers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Failed to fetch singers",
    });
  }
};
