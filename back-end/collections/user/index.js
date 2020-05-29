/*
 * @file: index.js
 * @description: It Contain function layer for user collection.
 * @author: Jasdeep Singh
 */

import mongoose from 'mongoose';
import dbSchema from './db-schema';

class UserClass {
  static checkEmail(email) {
    return this.findOne({ email });
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static checkToken(token) {
    return this.findOne({ 'loginToken.token': token });
  }
  static saveUser(payload) {
    return this(payload).save();
  }
  static onLoginDone(userId, data, type = 'default') {
    let payload = {token: data.token};
    if(data['device']){
      const device = data.device;
      payload = {
        ...payload,
        deviceToken: device.token,
        deviceType: device.type
      }
    }
    let updateData = {
      $push: { loginToken: payload },
      $set: {
        'lastLogin.loginDate': new Date(),
        'lastLogin.type': type
      }
    };
    return this.findByIdAndUpdate(userId, updateData, { new: true });
  }
  static logout(userId, token) {
    let updateData = {
      $pull: { loginToken: { token } }
    };
    return this.findByIdAndUpdate(userId, updateData);
  }
  static updateUser(userId, payload) {
    let updateData = {
      $set: payload
    };
    return this.findByIdAndUpdate(userId, updateData);
  }
}

dbSchema.loadClass(UserClass);

export default mongoose.model('User', dbSchema);