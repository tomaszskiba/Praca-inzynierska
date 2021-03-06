'use strict';

import mongoose from 'mongoose';
import * as _ from 'lodash';
import Promise from 'bluebird';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
import uniqueValidator from 'mongoose-unique-validator';

const userRole = {
  admin: 'admin',
  user: 'user'
};


const userRoles = [userRole.admin, userRole.user];


const userSchema = new mongoose.Schema({
  firstname: {type: String, required: true, unique: false},
  lastname: {type: String, required: true, unique: false},
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  role: { type: String, enum: userRoles, default: userRole.user, required: false },
  active: { type: Boolean, default: true, required: false },
  isAdmin: { type: Boolean, default: false, required: false }
}, {
  collection: 'user'
});

<<<<<<< HEAD

=======
>>>>>>> b1ad12f78ab5720334cfabd095ac153c6e1cf49d
userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', userSchema);
function createNewOrUpdate(user) {
  return Promise.resolve().then(() => {
    if (!user.id) {
      return new UserModel(user).save().then(result => {
        if (result) {
          return mongoConverter(result);
        }
      });
    } else {
      return UserModel.findOneAndUpdate(user.id, _.omit(user, 'id'), {new: true});
    }
  }).catch(error => {
    if ('ValidationError' === error.login) {
      error = error.errors[Object.keys(error.errors)[0]];
      throw applicationException.new(applicationException.BAD_REQUEST, error.message);
    }
    throw error;
  });
}

async function getByEmailOrLogin(login) {
  const result = await UserModel.findOne({ $or: [{ email: login }, { login: login }] });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}

async function get(id) {
  const result = await UserModel.findOne({ _id: id });
  if (result) {
    return mongoConverter(result);
  }
  throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}

async function removeById(id) {
  return await UserModel.findByIdAndRemove(id);
}
export default {
  createNewOrUpdate: createNewOrUpdate,
  getByEmailOrLogin: getByEmailOrLogin,
  //getUserByActivationHash: getUserByActivationHash,
  get: get,
  //getAllUsers: getAllUsers,
  removeById: removeById,

  userRole: userRole,
  model: UserModel
};
