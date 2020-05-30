/*
 * @file: number-otp.js
 * @description: It Contain verify-number router/api.
 * @author: Jasdeep Singh
 */
import express from 'express';
import { createValidator } from 'express-joi-validation';
import Joi from '@hapi/joi';
import { verifyOTP } from '../../../controllers/user';
import { checkToken } from '../../../utilities/universal';

const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/otp:
 *  post:
 *   tags: ["user"]
 *   summary: Send OTP and verify otp api
 *   description: api used to send OTP and verify OTP.<br/><b>type</b> should be one of send_otp OR verify_otp.
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: send OTP and verification.
 *        schema:
 *         type: object
 *         required:
 *          - OTP and verification
 *         properties:
 *           number:
 *             type: string
 *             required:
 *           type:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *     description: success
 *    '400':
 *     description: fail
 */
const userSchema = Joi.object({
  number: Joi.string().trim().required().label('Number'),
  type: Joi.string()
    .trim()
    .required()
    .valid('send_otp', 'verify_otp')
    .label('Type'),
});

app.post(
  '/user/otp',
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkToken,
  verifyOTP,
);

export default app;
