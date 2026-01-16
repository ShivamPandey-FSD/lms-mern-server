const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true,
  trim: true
 },
 email: {
  type: String,
  required: true,
  lowercase: true,
  unique: true
 },
 password: {
  type: String,
  required: true,
  select: false
 },
 role: {
  type: String,
  enum: ['Admin', 'User'],
  default: 'User'
 },
 accountVerified: {
  type: Boolean,
  default: false
 },
 refreshToken: {
  type: String,
  select: false
 },
 borrowedBooks: [
  {
   bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow'
   },
   returned: {
    type: Boolean,
    default: false
   },
   bookTitle: String,
   borrowedDate: Date,
   dueDate: Date
  }
 ],
 avatar: {
  public_id: String,
  url: String
 },
 verificationCode: Number,
 verificationCodeExpire: Date,
 resetPasswordToken: String,
 resetPasswordExpire: Date
}, {
 timestamps: true
})

userSchema.methods.generateVerificationCode = function () {
 function generateRandomFiveDigitNumber() {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 1000).toString().padStart(4, 0);
  return parseInt(firstDigit + remainingDigits);
 }
 const verificationCode = generateRandomFiveDigitNumber();
 this.verificationCode = verificationCode;
 this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
 return verificationCode;
}

userSchema.methods.generateAccessToken = function () {
 return jwt.sign(
  { id: this._id },
  process.env.JWT_SECRET_KEY,
  { expiresIn: process.env.JWT_EXPIRE }
 );
};

userSchema.methods.generateRefreshToken = function () {
 return jwt.sign(
  { id: this._id },
  process.env.JWT_SECRET_KEY,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
 );
};

userSchema.methods.getResetPasswordToken = function () {
 const resetToken = crypto.randomBytes(20).toString('hex');
 this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

 this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
 return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
