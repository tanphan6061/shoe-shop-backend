const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const District = require('../../models/district.model');
const Province = require('../../models/province.model');
const Ward = require('../../models/ward.model');
const User = require('../../models/user.model');

const router = express.Router();
const authRoutes = require('./auth.route');

const swaggerOptions = {
  swaggerDefinition: {
    // openapi: '3.0.0',
    info: {
      title: 'My-Blog Api', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'The api docs of My-Blog', // Description (optional)
    },
    host: `192.168.1.9:${process.env.PORT}`, // Host (optional)
    basePath: '/api', // Base path (optional)
  },
  apis: ['./routes/api/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * tags:
 * - name: Auth
 *   description: Auth api
 */
router.use('/auth', authRoutes);

router.get('/test', async (req, res, next) => {
  const ward = await Ward.findOne({ code: '10000' }).populate('.model');
  const user = await User.findOne({ ward: '10000' }).populate('wardInfo');
  return res.json({ ward, user });
});

module.exports = router;
