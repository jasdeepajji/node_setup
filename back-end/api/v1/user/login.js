/*
 * @file: login.js
 * @description: It Contain login router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { login } from '../../../controllers/user';
import { DEVICE } from '../../../utilities/constants';
const app = express();
const validator = createValidator({ passError: true });
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *   tags: ["user"]
 *   summary: user login api
 *   description: api used to login users<br/><b>Note:-</b> device is optional and <b>device type</b> should be one of ios or android.
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required:
 *           device:
 *             type: object
 *             properties:
 *              token:
 *               type: string   
 *               required:
 *              type:
 *               type: string   
 *               required:
 *   responses:
 *    '200':
 *     description: success
 *    '400':
 *     description: fail
 */

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .label("Email"),
    password: Joi.string()
        .required()
        .trim()
        .label("Password"),
    device: Joi.object({            
            token: Joi.string()
                .trim()
                .required()
                .label("Device Token"),            
            type: Joi.string()
                .trim()
                .required()
                .valid(DEVICE.ios, DEVICE.android)
                .label("Device Type")
        })
        .optional()
        .label("Device detail")
});

app.post('/user/login', validator.body(loginSchema, {
    joi: { convert: true, allowUnknown: false }
}), login);

export default app;