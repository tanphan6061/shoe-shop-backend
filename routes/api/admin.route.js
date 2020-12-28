const express = require('express');

const router = express.Router();
const controller = require('../../controllers/admin.controller');
const adminValidator = require('../../middlewares/validators/admin.validator');
const authValidator = require('../../middlewares/validators/auth.validator');

/**
 * @swagger
 * /admin/login:
 *  post:
 *    tags:
 *    - Admin
 *    summary: Admin login to system
 *    description: Login by username or email and password
 *    consumes:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: Admin login to system
 *      schema:
 *        type: Object
 *        properties:
 *         username:
 *          type: string
 *          example: admin
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
router.post('/login', adminValidator.login, controller.login);

/**
 * @swagger
 * /admin/refresh-token:
 *  post:
 *    tags:
 *    - Admin
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
router.post('/refresh-token', authValidator.isToken, controller.refreshToken);

/**
 * @swagger
 * /admin/logout:
 *  post:
 *    tags:
 *    - Admin
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
router.post('/logout', authValidator.isToken, controller.logout);

module.exports = router;
