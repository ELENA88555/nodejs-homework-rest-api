const {Schema, model} = require('mongoose')
const Joi = require("joi");
const {handleMongooseError} = require('../helpers')



const userSchema = new Schema({
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Set password for user'],
  },

email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,

},
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
  avatarURL: { type: String },
  token:{ type: String },
 
},

 {versionKey: false, timestamps: true}
 )

 userSchema.post('save', handleMongooseError)

const registerSchema= Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
 
})

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});


const schemas = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  emailSchema 
}

const User = model('user', userSchema)

module.exports = {
  User,
  schemas
}




