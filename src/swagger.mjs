import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    restapi: '3.0.0',
    info: {
      title: 'My Online Shop',
      version: '1.0.0',
      description: 'API Endpoints powering My Online Shop.'
    },
    servers: [
      {
        url: 'http://localhost:7000'
      }
    ]
  },
  apis: ['**/*.mjs']
};

const specs = swaggerJsdoc(options);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
