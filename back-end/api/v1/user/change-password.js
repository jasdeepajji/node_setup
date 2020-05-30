/*
 * @file: change-password.js
 * @description: It Contain change-password router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { checkToken } from '../../../utilities/universal';
import { changePassword } from '../../../controllers/user';
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/password:
 *  put:
 *   tags: ["user"]
 *   summary: Change password api for all Users
 *   description: api used to change password for users.<br/><b>type</b> should be one of reset OR update.
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: change password
 *        description: change password
 *        schema:
 *         type: object
 *         required:
 *          - user change-password
 *         properties:
 *           password:
 *             type: string
 *             required:
 *           type:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userSchema = Joi.object({
  password: Joi.string().trim().required().label('Password'),
  type: Joi.string()
    .trim()
    .required()
    .valid('reset', 'update')
    .label('Password Type'),
});

app.put(
  '/user/password',
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkToken,
  changePassword,
);

export default app;
