import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { transporter } from "../utilities/transporter.utility.js";
import { async_Handler } from "../utilities/async_Handler.utility.js";
import { err_Handler } from "../utilities/err_Handler.utility.js";
import { UserModel } from "../Models/User.model.js";
export const SignUp = async_Handler(async (req, res, next) => {
  const { firstName, lastName, dob, email, password, contact } = req.body;

  if (!firstName || !lastName || !dob || !email || !password || !contact) {
    return next(new err_Handler("All fields are required", 400));
  }

  /* ---------- AGE CALCULATION ---------- */
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  if (age < 15) {
    return res.send({
      success: false,
      msg: "Your age should be greater than 15",
    });
  }

  /* ---------- PASSWORD HASH ---------- */
  const hashedPassword = await bcrypt.hash(password, 10);

  /* ---------- PROFILE AVATAR ---------- */
  // const profileImage = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
  const profileImage = ` `;

  /* ---------- OTP ---------- */
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contact,

      age,
      profileImage,
      verifyOtp: hashedOtp,
      verifyOtpExpiresAt: Date.now() + 5 * 60 * 1000,
    });

    /* ---------- SEND EMAIL ---------- */
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(201).json({
      success: true,
      msg: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.send({ success: false, msg: "User already exist" });
    } else if (error.message) {
      return res.send({ success: false, msg: error.message });
    } else {
      return res.send({ success: false, msg: error });
    }
  }
});

export const verifyOtp = async_Handler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new err_Handler("Email and OTP are required", 400));
  }

  // 1️⃣ Find user
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.send({ success: false, msg: "User not found" });
  }

  // 2️⃣ Already verified
  if (user.isAccountVerified) {
    // return next(new err_Handler("Account already verified", 400));
    return res.send({ success: false, msg: "Account already verified" });
  }

  // 3️⃣ OTP expired
  if (user.verifyOtpExpiresAt < Date.now()) {
    // return next(new err_Handler("OTP has expired", 410));
    return res.send({ success: false, msg: "OTP has expired" });
  }
  // 4️⃣ Hash incoming OTP
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  // console.log(hashedOtpuser.verifyOtp)
  // 5️⃣ Compare OTP
  if (hashedOtp != user.verifyOtp) {
    return next(new err_Handler("Invalid OTP", 401));
  }

  // 6️⃣ Verify account
  user.isAccountVerified = true;
  user.verifyOtp = undefined;
  user.verifyOtpExpiresAt = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    msg: "Email verified successfully",
  });
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User Not found",
      });
    }
    // if(user.DOB)
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    if (!user.isAccountVerified) {
      return res.status(403).json({
        success: false,
        msg: "Please verify your account first",
      });
    }

    // 🔑 Short-lived access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    // 🔄 Long-lived refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" },
    );

    // Store refresh token (optional but recommended)
    user.refreshToken = refreshToken;
    await user.save();

    // 🍪 Send tokens in cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        msg: "Login successful",
        email: user.email,
      });
  } catch (error) {
    return res.send({ success: false, msg: error });
  }
};

export const refreshAccessToken = async (req, res) => {
  console.log(req.cookies)
  const refreshToken = req.cookies.refreshToken;
  console.log(req.cookies);
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      msg: "Login again",
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY,
    );

    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        msg: "Invalid refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.send({ success: true, msg: "refreshed successfully" });
  } catch (err) {
    return res.status(403).json({
      success: false,
      msg: "Refresh token expired",
    });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await UserModel.updateOne({ refreshToken }, { $set: { refreshToken: "" } });
  }

  res.clearCookie("accessToken").clearCookie("refreshToken").json({
    success: true,
    msg: "Logged out successfully",
  });
};

export const getLoggedInUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // from protect middleware

    const user = await UserModel.findById(userId).select(
      "-password -refreshToken -verifyotp -resetOtp",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, msg: "User already verified" });
    }

    // 🔑 Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // 🔒 Hash OTP
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // ✅ Save OTP + expiry in DB
    user.verifyOtp = hashedOtp;
    user.verifyOtpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // ✉️ Send OTP via email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "OTP Verification - Resend",
      text: `Hello ${user.firstName},\n\nYour OTP for account verification is: ${otp}\nThis OTP will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      msg: "OTP resent successfully. Please check your email.",
    });
  } catch (error) {
    return res.send({ success: false, msg: error });
  }
};

export const updateProfileImage = async (req, res) => {
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

export const UpdateUserLang = async (req, res, next) => {
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
};
