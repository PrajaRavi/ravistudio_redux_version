import express from "express"
import { getLoggedInUser, login, logout, refreshAccessToken, resendOtp, SignUp, verifyOtp } from "../Controllers/user.controller.js";
import {protect} from "../Middlewares/Toke.auth.js"
export const UserRouter=express.Router();

UserRouter.post("/login", login);
UserRouter.post("/signup", SignUp);
UserRouter.post("/verifyotp", verifyOtp);
UserRouter.post("/refresh-token", refreshAccessToken);
UserRouter.post("/logout", logout);
UserRouter.get("/me", protect, getLoggedInUser);
UserRouter.post("/resend-otp", resendOtp);