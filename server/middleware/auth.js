const jwt=require('jsonwebtoken');

const User= require('../models/user');

exports.authenticate=(req,res,next)=>{
    try {
        const token=req.header('Authorization');
        console.log(token);
        const user=jwt.verify(token,'secretkey');
        console.log(user);
        User.findByPk(user.userId)
        .then(user=>{
            console.log(JSON.stringify(user));
            req.user=user;
            console.log(req.user.id);
            next();
        })
        .catch(err=>{
            throw new Error(err);
        })
    } catch (error) {
        console.log(error);
       return res.status(401).json({success:false})
    }
}