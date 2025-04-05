const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    // Check if token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by ID
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Set both user and token in request object for flexibility
    req.userId = decoded.userId;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid or has expired",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
