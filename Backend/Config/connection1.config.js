import mongoose from "mongoose";

const url = "mongodb://0.0.0.0:27017/RaviStudio";
export const DBConnect = () => {
  // console.log(process.env.MONGODB_URI)
  mongoose.connect(url).then(() => {
    console.log("Database connected successfully");
  });
};
