const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
// const { connectToDatabase } = require("../utils/db");

// LOGIN USER CONTROLLER
const login = async (req, res) => {
  // await connectToDatabase();
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email }).lean();
    if (!user)
      return res.json({
        success: false,
        message: "Invalid Email or Password",
      });

    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass)
      return res.json({
        success: false,
        message: "Invalid Email or Password",
      });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        img: user.img,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    // Set cookie with correct configuration for cross-origin requests
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Always use secure in production and development with HTTPS
        maxAge: 60 * 60 * 1000,
        sameSite: "none", // Lowercase 'none' to ensure consistent behavior
        path: "/", // Add explicit path
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
      });
  } catch (error) {
    console.log(error);
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

// AUTH CHECK MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded_user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded_user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized User" });
  }
};

//LOGOUT USER CONTROLLER
const logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .json({ success: true, message: "Logged out Successfully" });
};

module.exports = {
  login,
  logout,
  authMiddleware,
};
