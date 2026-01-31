import express from "express";
import {
  addToFavourites,
  GetAllUser,
  GetFavouriteSongId,
  getLoggedInUser,
  login,
  logout,
  refreshAccessToken,
  resendOtp,
  SignUp,
  UpdateUser,
  verifyOtp,
} from "../Controllers/user.controller.js";
import { protect } from "../Middlewares/Toke.auth.js";
export const UserRouter = express.Router();

UserRouter.post("/login", login);
UserRouter.post("/signup", SignUp);
UserRouter.post("/verifyotp", verifyOtp);
UserRouter.post("/refresh-token", refreshAccessToken);
UserRouter.post("/logout", logout);
UserRouter.get("/me", protect, getLoggedInUser);
UserRouter.post("/resend-otp", resendOtp);
UserRouter.post("/add-favourite-song", protect, addToFavourites);
UserRouter.get("/get-favourite-songId", protect, GetFavouriteSongId);
UserRouter.post("/updateuser", protect, UpdateUser);
UserRouter.get("/get-all-user", protect, GetAllUser);
