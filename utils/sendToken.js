const sendToken = async (user, statusCode, message, res) => {
 const accessToken = user.generateAccessToken();
 const refreshToken = user.generateRefreshToken();

 user.refreshToken = refreshToken;
 await user.save({ validateBeforeSave: false });

 res
  .status(statusCode)
  .cookie('accessToken', accessToken, {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'strict',
   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
  })
  .cookie('refreshToken', refreshToken, {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'strict',
   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })
  .json({
   success: true,
   user,
   message
  });
};

module.exports = sendToken;
