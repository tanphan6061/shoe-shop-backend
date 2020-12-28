const express = require('express');

const router = express.Router();

const controller = require('../../controllers/auth.controller');
const validator = require('../../middlewares/validators/auth.validator');

/**
 * @swagger
 * /auth/send-code-active:
 *  post:
 *    tags:
 *    - Auth
 *    summary: send code active to email
 *    description: send code active to email
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: send code active to email
 *      schema:
 *        type: Object
 *        properties:
 *         email:
 *          type: string
 *          example: nguyencn17a@gmail.com
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post('/send-code-active', validator.sendCode, controller.sendCodeActive);

/**
 * @swagger
 * /auth/register:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Register
 *    description: Login by username or email and password
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: The user to create.
 *      schema:
 *        type: Object
 *        properties:
 *         email:
 *          type: string
 *          example: nguyencn17a@gmail.com
 *          required: true
 *         code:
 *          type: string
 *          example: 35dxXCx
 *          required: true
 *         name:
 *          type: string
 *          example: hai nguyen
 *          required: true
 *         phone:
 *          type: string
 *          example: "0988812332"
 *          required: true
 *         sex:
 *          type: string
 *          example: male
 *          required: true
 *         birthday:
 *          type: string
 *          example: 06-16-1999
 *          required: true
 *         password:
 *          type: string
 *          example: "123123"
 *          required: true
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post('/register', validator.register, controller.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *    - Auth
 *    summary: Login to system
 *    description: Login by username or email and password
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: The user to create.
 *      schema:
 *        type: Object
 *        properties:
 *         email:
 *          type: string
 *          example: nhoctargunn@gmail.com
 *         password:
 *          type: string
 *          example: "123123"
 *          required: true
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post('/login', validator.login, controller.login);

/**
 * @swagger
 * /auth/send-code-reset-password:
 *  post:
 *    tags:
 *    - Auth
 *    summary: send code reset password to email
 *    description: send code reset password to email
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: send code reset password to email
 *      schema:
 *        type: Object
 *        properties:
 *         email:
 *          type: string
 *          example: nhoctargunn@gmail.com
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post(
  '/send-code-reset-password',
  validator.sendCode,
  controller.sendCodeResetPassword,
);

/**
 * @swagger
 * /auth/reset-password:
 *  post:
 *    tags:
 *    - Auth
 *    summary: reset password
 *    description: reset password
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: reset password
 *      schema:
 *        type: Object
 *        properties:
 *         email:
 *          type: string
 *          example: nhoctargunn@gmail.com
 *         code:
 *          type: string
 *          example: 3aDxcDxc@
 *         newPassword:
 *          type: string
 *          example: "123123"
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post(
  '/reset-password',
  validator.resetPassword,
  controller.resetPassword,
);

/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *    tags:
 *    - Auth
 *    summary:  get new accessToken
 *    description:  get new accessToken
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: get new accessToken by refresh token
 *      schema:
 *        type: Object
 *        properties:
 *         token:
 *          type: string
 *          example: "dsZsdEfaVXCdsCd.we2341a2asdX"
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post('/refresh-token', validator.isToken, controller.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *  post:
 *    tags:
 *    - Auth
 *    summary: logout
 *    description: logout
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: Logout by refresh token
 *      schema:
 *        type: Object
 *        properties:
 *         token:
 *          type: string
 *          example: "dsZsdEfaVXCdsCd.we2341a2asdX"
 *    responses:
 *        200:
 *          description: success
 *        400:
 *          description: bad request
 */
router.post('/logout', validator.isToken, controller.logout);

module.exports = router;
