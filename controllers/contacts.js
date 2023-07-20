const { HttpError, ctrlWrapper } = require("../helpers");
// HttpError, 
const {Contact} = require("../models/contact");
const { schemas } = require("../models/contact");

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

// {}, "-createdAt -updatedAt"


const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res, next) => {
  const { error } = schemas.addSchema.validate(req.body);

  if (error) {
    throw HttpError(400, "missing required name field");
  }
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const remove = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res, next) => {
  const { error } = schemas.addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true, });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res, next) => {
  const { error } = schemas.addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateFavorite: ctrlWrapper(updateFavorite),
  remove: ctrlWrapper(remove),
  updateById: ctrlWrapper(updateById),
};