// Import necessary modules
import express from "express";
import cors from "cors";
import fs from "fs"; // NEW
import dotenv from "dotenv";
// exec - Needed to execute command in shell
import { exec } from "child_process"; // NEW
import path from "path"; // NEW

// for audio transcoding
import { parseFile } from "music-metadata";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";

import { UserModel } from "./Models/User.model.js";
import { SingerModel } from "./Models/Singer.model.js";
import multer from "multer";
import { protect } from "./Middlewares/Toke.auth.js";
import { DBConnect } from "./Config/connection1.config.js";
import { UserRouter } from "./Routes/user.route.js";
import { PlaylistRouter } from "./Routes/playlist.route.js";
import { SongRouter } from "./Routes/song.route.js";
import cookieParser from "cookie-parser";
import { SongModel } from "./Models/song.model.js";

dotenv.config();
// Set up port, defaulting to 2000 if not specified in environment
const port = process.env.PORT || 2000;

// Initialize Express application
const app = express();
DBConnect();

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
ffmpeg.setFfprobePath(ffprobeStatic.path);
app.use(cookieParser());
// Parse JSON and URL-encoded bodiesk
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("./Uploads"));
app.use(express.static("./Images/PlaylistImg"));
app.use(express.static("./Images/Profile"));
app.use(express.static("./Images/Singerimg"));
app.use(express.static("./Images/UserPlaylistImg"));

// creating roots
app.use("/user", UserRouter);
app.use("/playlist", PlaylistRouter);
app.use("/songs", SongRouter);

// Serve HLS output files statically (NEW)
app.use("/hls-output", express.static(path.join(process.cwd(), "hls-output")));
const Storage = multer.diskStorage({
  // DESTINATION MEANS ALL ABOUT THAT WHERE WE HAVE TO SAVE OUR FILES
  destination: function (req, file, cb) {
    cb(null, `./Upload`);
  },
  //HERE FILENAME MEANS IT IS ALL ABOUT WHAT WILL BE NAME OF OUR FILE
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); //file.originalname.split('.').pop() it will basically remove all the sentance before . means at 0th position
  },
});
const upload = multer({ storage: Storage });

// Define route for video upload

const getAllSingers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalSingers = await SingerModel.countDocuments();

    const singers = await SingerModel.find()
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

// call getallsinger something like this
//  GET /singers?page=1&limit=10
app.get("/singers", getAllSingers);

app.post("/update-user-language", protect, async (req, res) => {
  try {
    const { language } = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        msg: "Language is required",
      });
    }

    const userId = req.user.id; // from protect middleware

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { language },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Language updated successfully",
      language: user.language,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
});

const updateProfileImage = async (req, res) => {
  try {
    // 1️⃣ Check file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "Profile image is required",
      });
    }

    // 2️⃣ User ID from protect middleware
    const userId = req.user.id;

    // 3️⃣ Update user
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profileImage: req.file.filename },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // 4️⃣ Success response
    res.status(200).json({
      success: true,
      msg: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
};
app.post("/update-profile-image", protect, updateProfileImage);

// Serve HLS output files statically (NEW)
app.use("/hls-output", express.static(path.join(process.cwd(), "hls-output")));
const Storage_for_song_upload = multer.diskStorage({
  // DESTINATION MEANS ALL ABOUT THAT WHERE WE HAVE TO SAVE OUR FILES
  destination: function (req, file, cb) {
    cb(null, `./Upload`);
  },
  //HERE FILENAME MEANS IT IS ALL ABOUT WHAT WILL BE NAME OF OUR FILE
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); //file.originalname.split('.').pop() it will basically remove all the sentance before . means at 0th position
  },
});
const upload_for_song_upload = multer({ storage: Storage_for_song_upload });

const TranscodeAudio = async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send("Video not sent!");
  }

  // Generate a unique ID for the video
  const AudioId = req.file.filename;
  const uploadedAudioPath = req.file.path;

  // Define output folder structure (NEW)
  const outputFolderRootPath = `./hls-output/${AudioId}`;
  const outputFolderSubDirectoryPath = {
    Low: `${outputFolderRootPath}/Low`,
    Mid: `${outputFolderRootPath}/Mid`,
    High: `${outputFolderRootPath}/High`,
  };

  // Create directories if they don't exist, for storing output video (NEW)
  if (!fs.existsSync(outputFolderRootPath)) {
    // ./hls-output/video-id/360p/
    fs.mkdirSync(outputFolderSubDirectoryPath["Low"], { recursive: true });
    // ./hls-output/video-id/480p/
    fs.mkdirSync(outputFolderSubDirectoryPath["Mid"], { recursive: true });
    // ./hls-output/video-id/720p/
    fs.mkdirSync(outputFolderSubDirectoryPath["High"], { recursive: true });
    // ./hls-output/video-id/1080p/
  }

  // Define FFmpeg commands for different resolutions (NEW)
  const ffmpegCommands = [
    // Low Quality (64kbps) - For slow connections / 3G
    `ffmpeg -i ${uploadedAudioPath} -c:a aac -b:a 64k -f hls -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["Low"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["Low"]}/index.m3u8"`,

    // Mid Quality (128kbps) - Standard mobile/web streaming
    `ffmpeg -i ${uploadedAudioPath} -c:a aac -b:a 128k -f hls -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["Mid"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["Mid"]}/index.m3u8"`,

    // High Quality (320kbps) - For high-end audio / WiFi
    `ffmpeg -i ${uploadedAudioPath} -c:a aac -b:a 320k -f hls -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath["High"]}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath["High"]}/index.m3u8"`,
  ];
  // Function to execute a single FFmpeg command (NEW)
  const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
      // Execute ffmpeg command in shell
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };

  // Execute all FFmpeg commands concurrently (NEW)
  Promise.all(ffmpegCommands.map((cmd) => executeCommand(cmd)))
    .then(() => {
      // Create master playlist
      const masterPlaylistPath = `${outputFolderRootPath}/index.m3u8`; // ./hls-output/video-id/index.m3u8
      const masterPlaylistContent = `
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=64000,NAME="Low"
low/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=128000,NAME="Mid"
mid/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=320000,NAME="High"
high/index.m3u8
`.trim();
      fs.writeFileSync(masterPlaylistPath, masterPlaylistContent); // write the above content in the index.m3u8 file

      // Creating URLs for accessing the video streams
      const videoUrls = {
        master: `http://localhost:${port}/hls-output/${AudioId}/index.m3u8`,
        Low: `http://localhost:${port}/hls-output/${AudioId}/Low/index.m3u8`,
        Mid: `http://localhost:${port}/hls-output/${AudioId}/Mid/index.m3u8`,
        High: `http://localhost:${port}/hls-output/${AudioId}/High/index.m3u8`,
      };

      // just(uploadedAudioPath,videoUrls)
      // Send success response with video URLs
      req.uploadedAudioPath = uploadedAudioPath;
      req.audioURL = videoUrls;
      // res.status(200).json({ AudioId, videoUrls })
      next();
    })
    .catch((error) => {
      console.error(`HLS conversion error: ${error}`);

      // Clean up: Delete the uploaded video file
      try {
        fs.unlinkSync(uploadedAudioPath);
      } catch (err) {
        console.error(`Failed to delete original video file: ${err}`);
      }

      // Clean up: Delete the generated HLS files and folders
      try {
        fs.unlinkSync(outputFolderRootPath);
      } catch (err) {
        console.error(`Failed to delete generated HLS files: ${err}`);
      }

      // Send error response
      return res.status(500).send("HLS conversion failed!");
    });
};

// Whole pipe line to transcode the audio
app.post(
  "/api/upload",
  upload_for_song_upload.single("video"),
  TranscodeAudio,
  async (req, res) => {
    let filePath =
      "./Upload/" +
      String(req.uploadedAudioPath).substring(
        7,
        String(req.uploadedAudioPath).length,
      );
    let AudioURLObj = req.audioURL;
    console.log(filePath);
    try {
      /* ------------------ MUSIC METADATA ------------------ */
      const metadata = await parseFile(filePath, {
        native: true,
        duration: true,
      });

      const { common, format } = metadata;

      /* ------------------ COVER ART ------------------ */
      let coverImage = null;

      if (common.picture && common.picture.length > 0) {
        const pic = common.picture[0];

        coverImage = {
          format: pic.format,
          size: pic.data.length,
          buffer: pic.data,
        };

        if (coverOutputDir) {
          if (!fs.existsSync(coverOutputDir)) {
            fs.mkdirSync(coverOutputDir, { recursive: true });
          }

          const coverPath = path.join(
            coverOutputDir,
            `cover-${Date.now()}.${pic.format.split("/")[1]}`,
          );

          fs.writeFileSync(coverPath, pic.data);
          coverImage.path = coverPath;
        }
      }

      /* ------------------ FFPROBE (TECHNICAL DATA) ------------------ */
      const ffprobeData = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const audioStream = ffprobeData.streams.find(
        (s) => s.codec_type === "audio",
      );

      /* ------------------ FINAL STRUCTURED RESPONSE ------------------ */
      const myobj = {
        /* 🎵 Tags */
        title: common.title || "Unknow title",
        artist: common.artist || "Unknown artist",
        album: common.album || "Unknown album",
        genre: common.genre || [],
        year: common.year || null,
        language: common.language || "en",
        track: common.track?.no || "nothing",

        /* ⏱ Duration & Quality */
        duration: format.duration, // seconds
        bitrate: format.bitrate,
        sampleRate: format.sampleRate,
        numberOfChannels: format.numberOfChannels,

        /* 🎚 Codec / Stream Info */
        codec: audioStream?.codec_name,
        codecLong: audioStream?.codec_long_name,
        channels: audioStream?.channels,
        channelLayout: audioStream?.channel_layout,

        /* 🖼 Cover Art */
        coverImage,

        /* 📦 Raw (optional use) */
        raw: {
          musicMetadata: metadata,
          ffprobe: ffprobeData,
        },
      };
      console.log(AudioURLObj?.Low);
      console.log(AudioURLObj?.Mid);
      let data = await SongModel.create({
        title: String(myobj.title),
        artist: String(myobj.artist),
        album: String(myobj.album),
        genre: String(myobj.genre),
        year: myobj.year,
        language: myobj.language,
        track: myobj.track,
        duration: myobj.duration,
        coverImage: myobj.coverImage,
        audioURL: {
          low: String(AudioURLObj?.Low),
          medium: String(AudioURLObj?.Mid),
          high: String(AudioURLObj?.High),
          master: String(AudioURLObj?.master),
        },
      });

      console.log(await data.save());

      return res
        .status(200)
        .send({ success: true, msg: "sub thik hai bhai!!!!!" });
    } catch (error) {
      console.error("Audio metadata extraction failed:", error);
      throw error;
    }
  },
);

/**
 * Extract full metadata + cover art + duration from an audio file
 * @param {string} filePath - absolute path to master audio file
 * @param {string} [coverOutputDir] - optional directory to save cover image
 */

async function extractAudioMetadata(filePath, AudioURLObj) {
  filePath = "./Upload/" + String(filePath);
  console.log(filePath);
  try {
    /* ------------------ MUSIC METADATA ------------------ */
    const metadata = await parseFile(filePath, {
      native: true,
      duration: true,
    });

    const { common, format } = metadata;

    /* ------------------ COVER ART ------------------ */
    let coverImage = null;

    if (common.picture && common.picture.length > 0) {
      const pic = common.picture[0];

      coverImage = {
        format: pic.format,
        size: pic.data.length,
        buffer: pic.data,
      };

      if (coverOutputDir) {
        if (!fs.existsSync(coverOutputDir)) {
          fs.mkdirSync(coverOutputDir, { recursive: true });
        }

        const coverPath = path.join(
          coverOutputDir,
          `cover-${Date.now()}.${pic.format.split("/")[1]}`,
        );

        fs.writeFileSync(coverPath, pic.data);
        coverImage.path = coverPath;
      }
    }

    /* ------------------ FFPROBE (TECHNICAL DATA) ------------------ */
    const ffprobeData = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const audioStream = ffprobeData.streams.find(
      (s) => s.codec_type === "audio",
    );

    /* ------------------ FINAL STRUCTURED RESPONSE ------------------ */
    const myobj = {
      /* 🎵 Tags */
      title: common.title || "Unknow title",
      artist: common.artist || "Unknown artist",
      album: common.album || "Unknown album",
      genre: common.genre || [],
      year: common.year || null,
      language: common.language || "en",
      track: common.track?.no || "nothing",

      /* ⏱ Duration & Quality */
      duration: format.duration, // seconds
      bitrate: format.bitrate,
      sampleRate: format.sampleRate,
      numberOfChannels: format.numberOfChannels,

      /* 🎚 Codec / Stream Info */
      codec: audioStream?.codec_name,
      codecLong: audioStream?.codec_long_name,
      channels: audioStream?.channels,
      channelLayout: audioStream?.channel_layout,

      /* 🖼 Cover Art */
      coverImage,

      /* 📦 Raw (optional use) */
      raw: {
        musicMetadata: metadata,
        ffprobe: ffprobeData,
      },
    };
    console.log(AudioURLObj?.Low);
    console.log(AudioURLObj?.Mid);
    let data = await SongModel.create({
      title: String(myobj.title),
      artist: String(myobj.artist),
      album: String(myobj.album),
      genre: String(myobj.genre),
      year: myobj.year,
      language: myobj.language,
      track: myobj.track,
      duration: myobj.duration,
      coverImage: myobj.coverImage,
      audioURL: {
        low: String(AudioURLObj?.Low),
        medium: String(AudioURLObj?.Mid),
        high: String(AudioURLObj?.High),
        master: String(AudioURLObj?.master),
      },
    });

    console.log(await data.save());
    console.log("step1");
    return { success: true, msg: "sub thik hai bhai!!!!!" };
  } catch (error) {
    console.error("Audio metadata extraction failed:", error);
    throw error;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
