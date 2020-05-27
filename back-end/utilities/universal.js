/*
 * @file: universal.js
 * @description: It Contain function layer for all commom function.
 * @author: Jasdeep Singh
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../collections/user';
import { failAction } from './response';
import Message from './messages';
import {SOCIAL} from './constants';
const { jwtAlgo, jwtKey } = config.get('app');
const saltRounds = 10;

// password encryption.
export const encryptpassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};
// password decryption.
export const decryptpassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
// Generate random strings.
export const generateRandom = (length = 32, alphanumeric = true) => {
  let data = '',
    keys = '';

  if (alphanumeric) {
    keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  } else {
    keys = '0123456789';
  }

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};
/*********** Generate JWT token *************/
export const generateToken = data =>
  jwt.sign(data, jwtKey, { algorithm: jwtAlgo, expiresIn: '90d' });
/*********** Decode JWT token *************/
export const decodeToken = token => jwt.verify(token, jwtKey);
/*********** Verify token *************/
export const checkToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  let decoded = {};
  try {
    decoded = decodeToken(token);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await User.checkToken(token);
  if (user) {
    req.user = {...decoded, token};
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/********* Get login type ***********/
export const getLoginType = (type) => {
  switch(type){
    case SOCIAL.fbId:
    return "facebook";
    case SOCIAL.googleId:
    return "google";
    case SOCIAL.twitterId:
    return "twitter";
    default:
    return "default";
  }
}