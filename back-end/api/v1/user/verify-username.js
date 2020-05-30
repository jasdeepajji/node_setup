/*
 * @file: verify-username.js
 * @description: It Contain verify-username router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { verifyUsername } from '../../../controllers/user';
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/verify-username:
 *  get:
 *   tags: ["user"]
 *   summary: verify-username api for all Users
 *   description: api used to verify-username users.
 *   parameters:
 *      - in: query
 *        name: username
 *        type: string
 *        required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userSchema = Joi.object({
  username: Joi.string().trim().required().label('Username'),
});

app.get(
  '/user/verify-username',
  validator.query(userSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  verifyUsername,
);

export default app;
