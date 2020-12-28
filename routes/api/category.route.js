const express = require('express');

const router = express.Router();
const controller = require('../../controllers/category.controller');
const validator = require('../../middlewares/validators/category.validator');

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
// router.post('/login', validator.createCategory, controller.createCategory);

module.exports = router;
