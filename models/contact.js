const {Schema, model} = require('mongoose')
const Joi = require("joi");
const {handleMongooseError} = require('../helpers');

const  phoneno = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
       },
    phone: {
      type: String,
  
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true }
)


contactSchema.post('save',handleMongooseError )


const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(phoneno).required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})

const Contact = model('contact', contactSchema)

const schemas = {
   updateFavoriteSchema,
   addSchema,
}

module.exports = {
  Contact, 
  schemas,
}
