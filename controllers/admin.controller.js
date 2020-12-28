const jwt = require('jsonwebtoken');
const status = require('http-status');

const Admin = require('../models/admin.model');
const authMessages = require('../helpers/message/auth.message');

let refreshTokens = [];

const generateAccessToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIME_EXPIRED,
  });
  return token;
};

module.exports.login = async (req, res) => {
  const { email, username, password } = req.body;
  let admin = await Admin.findOne({
    $or: [{ email }, { username }],
  });
  if (!admin) {
    return res
      .status(status.NOT_FOUND)
      .json({ message: authMessages.USER_DOES_NOT_EXISTS });
  }

  admin.comparePassword(password, async (err, isMatch) => {
    if (!isMatch) {
      return res.status(status.UNAUTHORIZED).json({
        message: authMessages.LOGIN_FAIL,
      });
    }

    const accessToken = generateAccessToken(admin.id);
    const refreshToken = jwt.sign(
      { id: admin.id },
      process.env.JWT_REFRESH_SECRET,
    );

    refreshTokens.push(refreshToken);

    admin = await Admin.findOne({
      $or: [{ email }, { username }],
    }).select('-password -isDeleted -__v');

    return res.json({
      admin,
      accessToken,
      refreshToken,
    });
  });
};

module.exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!refreshTokens.includes(token)) {
    return res
      .status(status.FORBIDDEN)
      .json({ message: authMessages.INVALID_TOKEN });
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const adminId = decoded.id;
  if (adminId) {
    const newAccessToken = generateAccessToken(adminId);
    return res.json({ accessToken: newAccessToken });
  }
};

module.exports.logout = (req, res) => {
  const { token } = req.body;
  if (!refreshTokens.includes(token)) {
    return res
      .status(status.FORBIDDEN)
      .json({ message: authMessages.INVALID_TOKEN });
  }
  refreshTokens = refreshTokens.filter((item) => item !== token);
  return res.json({ message: authMessages.LOGOUT_SUCCESS });
};
