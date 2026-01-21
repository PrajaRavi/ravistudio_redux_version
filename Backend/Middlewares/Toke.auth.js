import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    // console.log(decoded)
    req.user = decoded; // attach user info to request

    next(); // ✅ allow request to continue
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
