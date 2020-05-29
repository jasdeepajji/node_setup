/*
 * @file: login.js
 * @description: It Contain register router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { register } from '../../../controllers/user';
import { ROLE } from '../../../utilities/constants';
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *   tags: ["user"]
 *   summary: user register api
 *   description: api used to register users.<br/><b>role</b> should be 2 => client, 3 => trader<br/><b>location</b> coordinates should be array like <b>[long, lat]</b>.
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *         type: object
 *         required:
 *          - user signup 
 *         properties:
 *           firstName:
 *             type: string
 *             required:
 *           lastName:
 *             type: string
 *           username:
 *             type: string
 *             required:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required:
 *           country:
 *             type: string
 *           address:
 *             type: string
 *             required:
 *           location:
 *             type: object
 *             properties:
 *              coordinates:
 *               type: array
 *               items:
 *                type: number      
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

const regiterSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .required()
        .label("First Name"),
    lastName: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label("Last Name"),
    username: Joi.string()
        .trim()
        .required()
        .label("Username"),
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .label("Email"),
    password: Joi.string()
        .trim()
        .required()
        .label("Password"),       
    country: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label("Country"),    
    address: Joi.string()
        .trim()
        .required()
        .label("Address"),
    location: Joi.object({
        coordinates: Joi.array().required().label("coordinates")
        })
        .required()
        .label("location"),
    role: Joi.number()
        .valid(ROLE.admin, ROLE.client, ROLE.trader)
        .required()
        .label("Role")
});

app.post('/user/register'
    , validator.body(regiterSchema, {
        joi: { convert: true, allowUnknown: false }
    }), register);

export default app;