const Joi = require('@hapi/joi');
const status = require('http-status');

module.exports.login = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .max(40)
      .pattern(
        new RegExp(
          /^[a-z][a-z0-9_\-\.]{2,32}@[a-z0-9_-]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
        ),
      )
      .insensitive()
      .messages({
        'string.pattern.base': 'Email invalid.',
      }),
    username: Joi.string().min(5).max(30).insensitive().trim(),
    password: Joi.string().required().insensitive(),
  }).or('email', 'username');

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(status.BAD_REQUEST).json({
      messages: error.message,
    });
  }

  next();
};
