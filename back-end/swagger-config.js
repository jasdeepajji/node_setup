/*
 * @file: swagger-config.js
 * @description: It Contain swagger configrations.
 * @author: Jasdeep Singh
 */
import swaggerJsDocs from 'swagger-jsdoc';
import config from 'config';
const { host, port } = config.get('app');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Figjam project apis',
            version: '1.0',
            description: 'All api end points',
            contact: {
                name: 'Jasdeep Singh'
            },
            servers: `${host}:${port}`
        },
        produces: ['application/json'],
        host: `${host}:${port}`
    },
    apis: ['./*/*/*/*.js']
};
export default swaggerJsDocs(swaggerOptions);