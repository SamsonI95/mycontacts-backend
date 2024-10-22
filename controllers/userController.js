const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }

  //Hash password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Hash Password: ", hashPassword);

  //Create a new user
  const user = await User.create({
    userName,
    email,
    password: hashPassword,
  });
  console.log(`User created ${user}`);

  //Send back a success message
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User detail is invalid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login a user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  //Compare password with hashPassword
  if (user && (await bcrypt.compare(password, user.password))) {
    //Create JWT token
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          userName: user.userName,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc Current user info
//@route GET /api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current user information" });
});

module.exports = { registerUser, loginUser, currentUser };
