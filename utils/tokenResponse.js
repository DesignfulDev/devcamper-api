const daysToMs = require('../utils/timeConverter');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create JWT
  const token = user.getSignedJwt();

  const options = {
    expires: new Date(Date.now() + daysToMs(process.env.JWT_COOKIE_EXPIRE)),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

module.exports = sendTokenResponse;
