const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsyncError = require('./catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const verifyToken = require('../utils/verifyToken');

const isAuthenticated = catchAsyncError(async (req, res, next) => {
 const { accessToken, refreshToken } = req.cookies || {};

 if (!refreshToken) {
  return next(new ErrorHandler("Login Required", 401));
 }

 if (accessToken) {
  const decodedAccess = verifyToken(accessToken, process.env.JWT_SECRET_KEY);

  if (decodedAccess) {
   req.user = decodedAccess.id;
   return next();
  }
 }

 const decodedRefresh = verifyToken(refreshToken, process.env.JWT_SECRET_KEY);

 if (!decodedRefresh) {
  return next(new ErrorHandler("Login Required", 401));
 }

 const user = await User.findById(decodedRefresh.id).select("+refreshToken");

 if (!user || user.refreshToken !== refreshToken) {
  return next(new ErrorHandler('Login Required', 401));
 }

 const newAccessToken = user.generateAccessToken();

 res.cookie('accessToken', newAccessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
 });

 req.user = user._id;
 next();
});

const isAuthorized = (...roles) => {
 return async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!roles.includes(user.role)) {
   return next(new ErrorHandler(`User with this role ${req.user.role} not allowed to access this resource`, 400));
  }
  next();
 }
}

module.exports = {isAuthenticated, isAuthorized};
