/*
 * @file: forgot-password.js
 * @description: It Contain forgot-password router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { forgotPassword } from '../../../controllers/user';
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/forgot-password:
 *  put:
 *   tags: ["user"]
 *   summary: forgot password api for all Users
 *   description: api used to forgot password password users.
 *   parameters:
 *      - in: body
 *        name: forgot password
 *        description: forgot password
 *        schema:
 *         type: object
 *         required:
 *          - user forgot-password
 *         properties:
 *           email:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userSchema = Joi.object({
  email: Joi.string().email().trim().required().label('Email'),
});

app.put(
  '/user/forgot-password',
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  forgotPassword,
);

export default app;
