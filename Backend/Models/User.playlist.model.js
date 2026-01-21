const PlaylistSchema = new Schema(
  {
    name: { type: String, required: true },

    image: { type: String, default: "" },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],

    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);
// 👇 ADD INDEX
PlaylistSchema.index({ userId: 1 });//1->acending -1->descending
/*
This tells MongoDB:
  Create a fast lookup table for userId in the playlists collection.
  So MongoDB can jump directly to playlists of a user instead of scanning everything.

*/



export const PlaylistModel = mongoose.model("Playlist", PlaylistSchema);
