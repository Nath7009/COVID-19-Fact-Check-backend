const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

//simple schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  //give different access rights if admin or not 
  isAdmin: Boolean
});


//custom method to generate authToken 
UserSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
  return token;
}

const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user) {
  //TODO trouver un moyen de renvoyer les codes d'erreur à l'utilisateur
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().error(new Error('bad username')),
    email: Joi.string().min(5).max(255).required().email().error(new Error('bad email')),
    password: Joi.string().min(3).max(255).required().error(new Error('bad password'))
  });

  return schema.validate(user);
}

exports.User = User; 
exports.validate = validateUser;