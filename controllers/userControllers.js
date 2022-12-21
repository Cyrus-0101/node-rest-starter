import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import Note from "../models/Note.js";

// @desc    Fetch all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (users?.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  return res.status(200).json(users);
});

// @desc    Fetch single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    return res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "All fields are required" });
    throw new Error("All fields are required");
  }

  // Check for duplicate
  const duplicateUser = await User.findOne({ username }).lean().exec();

  if (duplicateUser) {
    res.status(400).json({ message: "Username already exists" });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  const userObj = {
    username,
    password: hashedPassword,
    roles,
  };

  const user = await User.create(userObj);

  if (user) {
    return res.status(201).json({ message: `New User, ${username} created.` });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, active, roles } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicateUser = await User.findById(id).lean().exec();

  if (duplicateUser && duplicateUser?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exists" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  return res
    .status(200)
    .json({ message: `User ${updatedUser.username}, updated.` });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "All fields are required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    return res
      .status(400)
      .json({ message: "User has notes and cannot be deleted." });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `User ${result.username} deleted with ID ${result._id}.`;

  return res.status(200).json({ message: reply });
});
