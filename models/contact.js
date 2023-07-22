const {Schema, model} = require('mongoose')
const Joi = require("joi");
const {handleMongooseError} = require('../helpers')
// const Schema = mongoose.Schema;

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
  }
)
contactSchema.post('save',handleMongooseError )

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
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
