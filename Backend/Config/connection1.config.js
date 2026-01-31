import mongoose from "mongoose";

// const url = "mongodb://0.0.0.0:27017/RaviStudio";
export const DBConnect = () => {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    // console.log(process.env.MONGODB_URI)
    console.log("Database connected successfully");
  });
};
