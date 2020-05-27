/*
 * @file: login.js
 * @description: It Contain login router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { socialLogin } from '../../../controllers/user';
import { ROLE, DEVICE, SOCIAL } from '../../../utilities/constants';
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/social-login:
 *  post:
 *   tags: ["user"]
 *   summary: user social login api
 *   description: api used to social login users<br/><b>Note:-</b> device is optional and <b>device type</b> should be one of ios or android<br/><b>social key</b> should be one of fbId, googleId, twitterId.<br/><b>role</b> should be 2 => client, 3 => trader.
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to social login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           firstName:
 *             type: string
 *             required:
 *           lastName:
 *             type: string
 *           email:
 *             type: string
 *           profileImage:
 *             type: string
 *           device:
 *             type: object
 *             properties:
 *              token:
 *               type: string   
 *               required:
 *              type:
 *               type: string   
 *               required:
 *           social:
 *             type: object
 *             properties:
 *              key:
 *               type: string   
 *               required:
 *              value:
 *               type: string   
 *               required:
 *             required:
 *           role:
 *             type: integer
 *             required:
 *   responses:
 *    '200':
 *     description: success
 *    '400':
 *     description: fail
 */

const loginSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .required()
        .label("First Name"),
    lastName: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label("Last Name"),
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .optional()
        .allow('')
        .label("Email"),
    profileImage: Joi.string()
        .optional()
        .trim()
        .allow('')
        .label("Profile Image"),
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
        .label("Device detail"),
    social: Joi.object({            
            value: Joi.string()
                .trim()
                .required()
                .label("Social Id value"),            
            key: Joi.string()
                .trim()
                .required()
                .valid(SOCIAL.fbId, SOCIAL.googleId, SOCIAL.twitterId)
                .label("Social Type")
        })
        .required()
        .label("Social detail"),
    role: Joi.number()
        .valid(ROLE.client, ROLE.trader)
        .required()
        .label("Role")
});

app.post('/user/social-login', validator.body(loginSchema, {
    joi: { convert: true, allowUnknown: false }
}), socialLogin);

export default app;