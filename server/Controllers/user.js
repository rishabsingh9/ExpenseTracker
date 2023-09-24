const { json } = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const saltrounds = 10;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      console.log(err);
      const data = await User.create({ name, email, password: hash });

      res.status(201).json({ newUsers: data });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const data = await User.findAll({ where: { email } });
    if (data.length > 0) {
      bcrypt.compare(password, data[0].password, (err, result) => {
        if (err) {
          throw new Error("Something went wrong");
        }
        if (result == true) {
          res
            .status(200)
            .json({ success: true, message: "User logged in successfully" });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Incorrect Password" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Doesn;t Exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
