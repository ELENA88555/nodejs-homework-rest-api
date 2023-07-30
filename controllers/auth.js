const { User } = require("../models/user");
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const hasPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hasPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}" > Click verify email </a>`
  };

  await sendEmail(verifyEmail)

  res.status(201).json({
    email: newUser.email,
    password: newUser.password,
    subscription: newUser.subscription,
  });
};

const verifyEmail = async (req, res) => {
 const {verificationToken} = req.params;
 const user = await User.findOne({verificationToken})

 if(!user) {
  throw HttpError(404, 'User not found')
 }
 await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null})

 res.json({
  message: 'Verification successful'
 })

}

const   resendVerifyEmail = async (req, res)=> {
  const {email} = req.body;
  const user = await User.findOne({email})
  if(!user){
    throw HttpError(400, "missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${user.verificationToken}" > Click verify email </a>`
  };

  await sendEmail(verifyEmail)

  res.json({
    message: "Verification email sent success"
  })
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

if (!user.verify){
  throw HttpError(401, "Email or password is wrong");
}

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email not verified");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const subscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarUrl = path.join("avatars", filename);

  Jimp.read(resultUpload, (error, image) => {
    if (error) {
      throw HttpError(404, "NOT FOUND AVATAR");
    }
    image.resize(250, 250).write(resultUpload);
  });

  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.json({ avatarUrl });
};

module.exports = {

  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
