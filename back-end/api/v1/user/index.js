/*
 * @file: index.js
 * @description: It's combine all user routers.
 * @author: Jasdeep Singh
 */

import regiter from './register';
import login from './login';
import socialLogin from './social-login';
import forgotPassword from './forgot-password';
import changePassword from './change-password';
import logout from './logout';
import verifyUsername from './verify-username';
import numberOtp from './number-otp';

export default [regiter, login, socialLogin, forgotPassword, changePassword, logout, verifyUsername, numberOtp];
