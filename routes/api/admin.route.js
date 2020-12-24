const express = require('express');

const router = express.Router();
const controller = require('../../controllers/auth.controller');
const validator = require('../../middlewares/validators/auth.validator');

module.exports = router;
