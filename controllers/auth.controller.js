const jwt = require('jsonwebtoken');
const status = require('http-status');
const shortid = require('shortid');
const mail = require('../helpers/mail');
const authMessages = require('../helpers/message/auth.message');
// const redis = require('../services/redis');

// const expireRefreshTokenTime = process.env.JWT_REFRESH_TIME_EXPIRED || 1800; // in seconds

let refreshTokens = [];

const User = require('../models/user.model');
const Verification = require('../models/verification.model');

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@',
);

const sendCode = async (verification) => {
  mail.send(
    verification.email,
    `${verification.code} is your account authentication code`,
    `<span style=" text-transform: capitalize;"> Hi bro,</span><br/>
        Your account authentication code in ${process.env.APP_NAME} is:
         <div style="display:flex;justify-content:center">
         <h1 style="background:#28a745; padding:1.5rem; border-radius:5px ; color:white; display:inline-block">${verification.code}</h1>
         </div>
         <p style="color:red">
         * Note: Your verification code only exists for ${verification.time} minutes
         </p>`,
  );
};

const generateAccessToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIME_EXPIRED,
  });
  return token;
};

const checkCode = async (email, code, type = 'active') => {
  const verification = await Verification.findOne({ email, type });
  if (!verification) return false;
  // eslint-disable-next-line operator-linebreak
  const timeOfCode = new Date() - new Date(verification.updatedAt);
  const codeIsExpired = timeOfCode / 60000 > verification.time;
  if (verification.code !== code || codeIsExpired) {
    return false;
  }
  return true;
};

module.exports.register = async (req, res) => {
  const { email, name, password, phone, sex, birthday, code } = req.body;

  let user = await User.findOne({
    email,
  });
  if (user) {
    return res.status(status.BAD_REQUEST).json({
      message: authMessages.EMAIL_ALREADY_REGISTERED,
    });
  }

  const isCorrectCode = await checkCode(email, code, 'active');
  if (!isCorrectCode) {
    return res
      .status(status.BAD_REQUEST)
      .json({ message: authMessages.VERIFY_FAIL });
  }
  try {
    user = await User.create({
      email,
      name,
      password,
      phone,
      sex,
      birthday,
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
    );

    refreshTokens.push(refreshToken);

    user = await User.findOne({ email }).select('-password -isDeleted -__v');
    return res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

module.exports.sendCodeActive = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });

  if (user) {
    return res.status(status.CONFLICT).json({
      message: authMessages.EMAIL_ALREADY_REGISTERED,
    });
  }

  try {
    let verification = await Verification.findOne({ email, type: 'active' });
    if (verification) {
      verification.code = shortid.generate();
      await verification.save();
    } else {
      verification = await Verification.create({
        email,
        code: shortid.generate(),
      });
    }
    sendCode(verification);
    return res.json({ message: authMessages.SEND_CODE_SUCCESS });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

module.exports.sendCodeResetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(status.CONFLICT).json({
      message: authMessages.USER_DOES_NOT_EXISTS,
    });
  }

  try {
    let verification = await Verification.findOne({
      email,
      type: 'reset-password',
    });
    if (verification) {
      verification.code = shortid.generate();
      await verification.save();
    } else {
      verification = await Verification.create({
        email,
        code: shortid.generate(),
        type: 'reset-password',
      });
    }
    sendCode(verification);
    return res.json({ message: authMessages.SEND_CODE_SUCCESS });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(status.CONFLICT).json({
      message: authMessages.USER_DOES_NOT_EXISTS,
    });
  }

  const isCorrectCode = await checkCode(email, code, 'reset-password');
  if (!isCorrectCode) {
    return res
      .status(status.BAD_REQUEST)
      .json({ message: authMessages.VERIFY_FAIL });
  }
  try {
    user.password = newPassword;
    await user.save();
    return res.json({ message: authMessages.RESET_PASSWORD_SUCCESS });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({
    email,
  });

  if (!user) {
    return res
      .status(status.NOT_FOUND)
      .json({ message: authMessages.USER_DOES_NOT_EXISTS });
  }

  user.comparePassword(password, async (err, isMatch) => {
    if (!isMatch) {
      return res.status(status.UNAUTHORIZED).json({
        message: authMessages.LOGIN_FAIL,
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
    );

    refreshTokens.push(refreshToken);

    user = await User.findOne({ email }).select('-password -isDeleted -__v');
    return res.json({
      user,
      accessToken,
      refreshToken,
    });
  });
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

module.exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!refreshTokens.includes(token)) {
    return res
      .status(status.FORBIDDEN)
      .json({ message: authMessages.INVALID_TOKEN });
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const userId = decoded.id;
  if (userId) {
    const newAccessToken = generateAccessToken(userId);
    return res.json({ accessToken: newAccessToken });
  }
};
