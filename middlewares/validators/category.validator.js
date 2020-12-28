const Joi = require('@hapi/joi');
const status = require('http-status');

module.exports.createCategory = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .max(40)
      .trim()
      .pattern(
        new RegExp(
          /^[a-z][a-z0-9_\-\.]{2,32}@[a-z0-9_-]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
        ),
      )
      .insensitive()
      .messages({
        'string.pattern.base': 'Email invalid.',
      })
      .required(),
    code: Joi.string().required().trim(),
    name: Joi.string().required().min(5).max(30).trim(),
    phone: Joi.string()
      .required()
      .pattern(new RegExp(/[+0-9]{10,11}/))
      .trim(),
    sex: Joi.string().required().trim().valid('male', 'female', 'unknown'),
    birthday: Joi.date().required(),
    password: Joi.string().required().insensitive().min(5).trim(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(status.BAD_REQUEST).json({
      message: error.message,
    });
  }

  next();
};
