/*
 * @file: user.js
 * @description: It Contain function layer for user service.
 * @author: Jasdeep Singh
 */

import User from '../collections/user';
import Message from '../utilities/messages';
import { encryptpassword, decryptpassword, generateToken, generateRandom, getLoginType } from '../utilities/universal';
import * as Mail from "../utilities/mail";

/************ User register *************/
export const save = async (payload) => {
    if (await User.checkEmail(payload.email)) throw new Error(Message.emailAlreadyExists);
    payload.password = await encryptpassword(payload.password);
    payload.username = `${payload.firstName.toLowerCase()}_${generateRandom(3).toLowerCase()}`;    
    const data = await User.saveUser({
        ...payload
    });
    // const token = generateToken({
    //     _id: userData._id,
    //     role: userData.role,
    //     email: userData.email,
    //     when: new Date()
    // });
    // const data = await User.onLoginDone(userData._id, token);
    return {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        lastLogin: data.lastLogin.type,
        role: data.role,
        profileImage: data.profileImage
    };
}
/************ User login *************/
export const onLogin = async (payload) => {
    const userData = await User.findOneByCondition({ email: payload.email });
    if (!userData || (userData && !await decryptpassword(payload.password, userData.password)) ) throw new Error(Message.invalidCredentials);
    if (userData.status === 0) throw new Error(Message.unauthorizedUser);
    if (userData.status === 2) throw new Error(Message.userBlocked);
    const token = generateToken({
        _id: userData._id,
        role: userData.role,
        email: userData.email,
        when: new Date()
    });
    const data = await User.onLoginDone(userData._id, {...payload, token});
    return {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        loginToken: token,
        lastLogin: userData.lastLogin.type,
        role: data.role,
        profileImage: data.profileImage
    };
} 
/************ Social login *************/
export const onSocialLogin = async (payload) => {
    const userData = await User.findOneByCondition({ [`social.${payload.social.key}`]: payload.social.value });
    if (userData && userData.status === 0) throw new Error(Message.unauthorizedUser);
    if (userData && userData.status === 2) throw new Error(Message.userBlocked);   
    payload.username = `${payload.firstName.toLowerCase()}_${generateRandom(3).toLowerCase()}`; 
    payload.password = await encryptpassword(generateRandom(8));
    let data = {};
    if(!userData){
        data = await User.saveUser({...payload, [`social.${payload.social.key}`]: payload.social.value});
        const token = generateToken({
            _id: data._id,
            role: data.role,
            email: data.email,
            when: new Date()
        });
        data = await User.onLoginDone(data._id, {...payload, token}, getLoginType(payload.social.key)); 
    } else {
        const token = generateToken({
            _id: userData._id,
            role: userData.role,
            email: userData.email,
            when: new Date()
        });
        let updateObject = {...payload};
        if(updateObject['device']){            
            const device = updateObject.device;
            delete updateObject.device;
            updateObject = {
              ...updateObject,
              'device.token': device.token,
              'device.type': device.type
            }
        }
        const social = updateObject.social;
        delete updateObject.social;
        data = await User.updateUser(userData._id, {
            ...updateObject,
            [`social.${social.key}`]: social.value,
            'loginToken.token': token,            
            'loginToken.createdAt': new Date(),
            'lastLogin.loginDate': new Date(),
            'lastLogin.type': getLoginType(social.key)
        });
    }  
    return {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        loginToken: data.loginToken.token,
        lastLogin: userData ? userData.lastLogin.type : '',
        role: data.role,
        profileImage: data.profileImage
    };
} 
/************ Forgot user password *************/
export const forgotPass = async (payload) => {
    const userData = await User.checkEmail(payload.email);
    if (!userData) throw new Error(Message.emailNotExists);
    const password = generateRandom(8);
    const data = await User.updateUser(userData._id, {password: await encryptpassword(password)});
    const result = await Mail.htmlFromatWithObject(
        {
          data: userData,
          emailTemplate: "forgot-password",
          password
        },
      );
      const emailData = {
        to: payload.email,
        subject: Mail.subjects.forgetPassword,
        obj: result.html,
        templateId: "forgot-password"
      };
    
      Mail.SENDEMAIL(emailData, function (err, res) {
        if (err)
          console.log(
            "-----@@----- Error at sending verify mail to user -----@@-----",
            err
          );
        else
          console.log(
            "-----@@----- Response at sending verify mail to user -----@@-----",
            res
          );
      });
      return data;
} 
/************ Update user password *************/
export const updatePassword = async (payload) => {
    return await User.updateUser(payload.userId, {password: await encryptpassword(payload.password)});
}
/*********** User logout ************/
export const userLogout = async (payload) => {
    return await User.updateUser(payload.userId, {
        'device.token': '',
        'device.type': '',
        'loginToken.token': '',
    });
}