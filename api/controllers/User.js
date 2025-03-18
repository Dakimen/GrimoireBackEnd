const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const isUserExist = await User.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (isUserExist) {
    return res.status(400).json({
      message: `L'utilisateur ${req.body.email} existe déjà`,
    });
  }

  bcrypt.hash(req.body.password.replaceAll(" ", ""), 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new User({
        ...req.body,
        email: req.body.email.toLowerCase(),
        password: hash,
      });
      user
        .save()
        .then((result) => {
          const token = jwt.sign(
            {
              _id: result._id,
              email: result.email,
            },
            process.env.JWT_KEY
          );

          res.status(201).json({
            message: "Votre compte a été créé avec succès",
            userId: user._id,
            token,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message:
              "Une erreur s'est produite lors de la création de votre compte",
            error: err.message,
          });
        });
    }
  });
};
exports.loginUser = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  await User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "L'utilisateur n'existe pas",
        });
      }
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Votre mot de passe est incorrect",
          });
        }
        delete user.password;
        if (result) {
          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
            },
            process.env.JWT_KEY
          );
          let response = {
            token,
            userId: user._id,
          };
          res.status(200).json(response);
        } else {
          return res.status(401).json({
            message: "Votre mot de passe est incorrect",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: err.message,
      });
    });
};
