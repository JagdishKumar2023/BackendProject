import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = createToken(user._id);

    // Respond with token
    res.json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.json({
      success: false,
      message: "Internal Server Error during login",
    });
  }
};

// Function to create JWT token with expiration time
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength (at least 8 characters)
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save user to the database
    const user = await newUser.save();
    // Create JWT token
    const token = createToken(user._id);

    // Respond with the token and success message
    res.json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.json({
      success: false,
      message: "Internal Server Error during registration",
    });
  }
};

export { loginUser, registerUser };
