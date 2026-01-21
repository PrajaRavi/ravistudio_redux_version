import mongoose from "mongoose";
const url = "mongodb://0.0.0.0:27017/RaviStudio";
export const DBConnect = () => {
  mongoose.connect(url).then(() => {
    console.log("Database connected successfully");
  });
};
