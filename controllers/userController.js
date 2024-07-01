import User from "../models/userSchema.js";
import Account from "../models/accountSchema.js"; // Add this import

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      role,
    });
    // Save the new user to the database
    const savedUser = await newUser.save();

    // Create a new account for the user
    const newAccount = new Account({
      userId: savedUser._id,
      balance: 0,
      transactions: [],
    });
    await newAccount.save();

    const result = {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      account: newAccount,
      createdAt: savedUser.createdAt,
    };
    // Generate authentication token for the user
    const token = newUser.generateAuthToken();
    // Set the cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 3600000), // 1 hour
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "DEVELOPMENT",
    };
    // Send the response
    res.status(201).cookie("token", token, cookieOptions).json({
      success: true,
      message: "User registered successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
      });
    }

    const isPasswordMatch = await user.matchPassword(password);

    // If passwords don't match, return an error response
    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Password does not match",
      });
    }

    // Fetch the user's account information
    const account = await Account.findOne({ userId: user._id });

    // Generate authentication token for the user
    const token = await user.generateAuthToken();

    // Prepare user data to be sent in the response
    const userWithOutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      account: {
        balance: account.balance,
        transactions: account.transactions,
      },
      createdAt: user.createdAt,
    };

    // Send the response with a cookie containing the authentication token
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
        secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true,
      })
      .json({
        success: true,
        message: "User Logged in successfully",
        user: userWithOutPassword,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout user
const logout = (req, res) => {
  // Clear the authentication token cookie
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "DEVELOPMENT" ? "lax" : "none",
      secure: process.env.NODE_ENV === "DEVELOPMENT" ? false : true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const account = await Account.findOne({ userId: user._id });
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      account: {
        balance: account.balance,
        transactions: account.transactions,
      },
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { register, login, logout, getUserProfile };
