/*
 * @file: db-schema.js
 * @description: It Contain db schema for user collection.
 * @author: Jasdeep Singh
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  loginToken: [
    {
      token: {
        type: String,
        default: ''
      },
      createdAt: {
        type: Date,
        default: new Date()
      },
      deviceToken: { type: String, default: '' },
      deviceType: { type: String, default: '' }
    }
  ],
  social: {
    fbId: { type: String, default: '' },
    googleId: { type: String, default: '' },
    twitterId: { type: String, default: '' }
  },  
  status: {
    type: Number,
    default: 1 // 0 account removed, 1 active, 2 block
  },
  followers: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: {
        type: Date,
        default: new Date()
      },
    }
  ], 
  lastLogin: {
    loginDate: {
      type: Date,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  address: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  phone: {
    number: { type: String, default: ''},
    otp: { type: String, default: ''},
    verification: { type: Boolean, default: false},
  },
  location: {
    type: { type: String,  default: 'Point'},
    coordinates: []
  },
  role: {
    type: Number,
    default: 2, // 1 admin, 2 client, 3 trader
  }
}, { timestamps: true });

export default userSchema.index( { location : '2dsphere' } );