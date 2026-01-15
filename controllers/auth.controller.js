const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const sendVerificationCode = require('../utils/sendVerificationCode');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const { generateForgotPasswordEmailTemplate } = require('../utils/emailTemplate')
const crypto = require('crypto');

const register = catchAsyncError(async (req, res, next) => {
 try {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
   return next(new ErrorHandler("Please fill all fields in the forms", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });

  if (isRegistered) {
   return next(new ErrorHandler("User already exists", 400));
  }

  const registrationAttemptsByUser = await User.find({
   email,
   accountVerified: false
  });

  if (registrationAttemptsByUser.length >= 5) {
   return next(new ErrorHandler("You have exceeded the number of registration attempts. Please contact support", 400));
  }

  if (password.length < 8 || password.length > 16) {
   return next(new ErrorHandler("Password length must be between 8 to 16 characters", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
   name,
   email,
   password: hashedPassword
  });
  const verificationCode = await user.generateVerificationCode();
  await user.save();
  sendVerificationCode(verificationCode, email, res);
 } catch (error) {
  next(error);
 }
});

const verifyOtp = catchAsyncError(async (req, res, next) => {
 try {
  const { email, otp } = req.body || {};

  if (!email || !otp) {
   return next(new ErrorHandler("Email or OTP is missing", 400));
  }

  const userAllEntries = await User.find({
   email,
   accountVerified: false
  }).sort({ createdAt: -1 });

  if (!userAllEntries) {
   return next(new ErrorHandler("User not found", 404));
  }

  let user;

  if (userAllEntries.length > 1) {
   user = userAllEntries[0];
   await User.deleteMany({
    _id: { $ne: user._id },
    email,
    accountVerified: false
   })
  } else {
   user = userAllEntries[0];
  }

  if (user.verificationCode !== Number(otp)) {
   return next(new ErrorHandler("Invalid OTP", 400));
  }

  const currentTime = Date.now();
  const verificatioCodeExpire = user.verificationCodeExpire.getTime();

  if (currentTime > verificatioCodeExpire) {
   return next(new ErrorHandler("OTP is expired. Please try again", 400));
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;
  await user.save({ validateModifiedOnly: true });

  sendToken(user, 200, "Account Verified", res);
 } catch (error) {
  return next(new ErrorHandler(`Internal Server Error: ${error}`, 500));
 }
})

const login = catchAsyncError(async (req, res, next) => {
 const { email, password } = req.body || {};

 if (!email || !password) {
  return next(new ErrorHandler("Please enter all the required fields", 400));
 }

 const user = await User.findOne({ email, accountVerified: true }).select("+password");

 if (!user) {
  return next(new ErrorHandler("Invalid email or password", 400));
 }

 const isPasswordMatched = await bcrypt.compare(password, user.password);

 if (!isPasswordMatched) {
  return next(new ErrorHandler("Please enter valid password", 400));
 }
 sendToken(user, 200, "Logged In Successfully", res);
});

const logout = catchAsyncError(async (req, res, next) => {
 const user = await User.findById(req.user).select('+refreshToken');

 user.refreshToken = null;
 await user.save({ validateBeforeSave: false });

 res
  .clearCookie('accessToken')
  .clearCookie('refreshToken')
  .status(200)
  .json({ success: true, messsage: "Logged Out Successfully" });
});

const getUsers = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user).select('+password +refreshToken');
  return res.status(200).json({
    success: true,
    user
  })
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_PORT}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);
  
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery (BookShelf LMS)",
      message
    });
    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    })
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() }
  })

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
  }

  if (req.body.password.length < 8 || req.body.password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 to 16 characters", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password and confirm password do not match", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, "Password reset successfully", res);
});


module.exports = {
 register,
 verifyOtp,
 login,
 logout,
 getUsers,
 forgotPassword,
 resetPassword
}
