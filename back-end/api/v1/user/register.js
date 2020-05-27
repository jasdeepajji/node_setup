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
 *   description: api used to register users
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
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
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