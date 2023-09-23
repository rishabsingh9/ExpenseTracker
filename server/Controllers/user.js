const User=require('../models/user');

exports.addUser=async(req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    try{
        
    const data=await User.create({
        name:name,
        email:email,
        password:password
    });

    res.status(201).json({newUsers:data})
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error:err
        })
    }
}
