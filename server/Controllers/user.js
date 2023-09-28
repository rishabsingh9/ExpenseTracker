const { json } = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');

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

function generateAccessToken(id,name,isPremiumUser){
return jwt.sign({userId:id,name:name,isPremiumUser},'secretkey')
}

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
            .json({ success: true, message: "User logged in successfully" ,token:generateAccessToken(data[0].id,data[0].name,data[0].isPremiumUser)});
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
exports.getUser=async(req,res,next)=>{
  try{
  const data=await User.findOne({where:{id:req.user.id}});
  res.status(201).json({user:data});
  }
  catch(err){
    return res
    .status(404)
    .json({ error:err});
  }
}
