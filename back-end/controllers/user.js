/*
 * @file: user.js
 * @description: It Contain function layer for user controller.
 * @author: Jasdeep Singh
 */

import { successAction, failAction } from '../utilities/response';
import { save, onLogin, onSocialLogin, forgotPass, updatePassword, userLogout } from '../services/user';
import Message from '../utilities/messages';

/**************** User signup/register ***********/
export const register = async (req, res, next) => {
    const payload = req.body;
    try {
        const data = await save(payload);
        res.status(200).json(successAction(data, Message.registerSuccess));
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};
/**************** Login user ***********/
export const login = async (req, res, next) => {
    const payload = req.body;
    try {
        const data = await onLogin(payload);
        res.status(200).json(successAction(data, Message.success));
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
}; 
/**************** Social login *************/
export const socialLogin = async (req, res, next) => {
    const payload = req.body;
    try {
        const data = await onSocialLogin(payload);
        res.status(200).json(successAction(data, Message.success));
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
}; 
/**************** Forgot password ***********/
export const forgotPassword = async (req, res, next) => {
    const payload = req.body;
    try {
        await forgotPass(payload);
        res.status(200).json(successAction(null, Message.passEmail));
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
}; 
/************* Change password ***********/
export const changePassword = async (req, res, next) => {
    const payload = req.body;
    payload.userId = req.user._id;
    try {
        await updatePassword(payload);
        res.status(200).json(successAction(null, Message.updatePassword));
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
}; 
/*********** Logout user *************/
export const logout = async (req, res, next) => {
    payload.userId = req.user._id;
    payload.token = req.user.token;
    try {
        await userLogout(payload);
        res.status(200).json(successAction(null, Message.success));
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
}; 