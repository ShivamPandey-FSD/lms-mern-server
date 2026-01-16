const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

const getAllUsers = catchAsyncError(async (req, res, next) => {
 const users = await User.find({ role: 'User' });
 return res.status(200).json({
  success: true,
  users
 })
})

const registerNewAdmin = catchAsyncError(async (req, res, next) => {
 if (!req.files || Object.keys(req.files).length === 0) {
  return next(new ErrorHandler("Admin avatar is required", 400));
 }

 const { name, email, password } = req.body;
 if (!name || !email || !password) {
  return next(new ErrorHandler("All fields are required", 400));
 }

 const isRegistered = await User.findOne({ email, accountVerified: true });

 if (isRegistered) {
  return next(new ErrorHandler("User already exists", 400));
 }

 if (password.length < 8 || password.length > 16) {
  return next(new ErrorHandler("Password must be between 8 to 16 characters", 400));
 }

 const { avatar } = req.files;
 const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
 if (!allowedFormats.includes(avatar.mimetype)) {
  return next(new ErrorHandler("File format not supported", 400));
 }

 const hashedPassword = await bcrypt.hash(password, 10);
 const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
  folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS"
 })

 if (!cloudinaryResponse || cloudinaryResponse.error) {
  console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unknown cloudinary error");
  return next(new ErrorHandler("Failed to upload avatar image", 400));
 }

 const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "Admin",
  accountVerified: true,
  avatar: {
   public_id: cloudinaryResponse.public_id,
   url: cloudinaryResponse.secure_url
  }
 });

 return res.status(200).json({
  success: true,
  message: "Admin Registered Successfully"
 })
})

module.exports = {
 getAllUsers,
 registerNewAdmin
}
