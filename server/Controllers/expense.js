const Expense=require('../models/expense');
const User = require('../models/user');

exports.addExpense=async(req,res,next)=>{
      const{expenseAmount,description,category}=req.body;  
      const userId=req.user.id;

    try {
        const data=await Expense.create({expenseAmount,description,category,userId});
        res.status(200).json({newExpense:data});
    } catch (err) {
        console.log(err);
    res.status(500).json({
      error: err,
    });
    }
}

exports.getExpense=async(req,res,next)=>{
    try {
       const data=await Expense.findAll({where:{userId:req.user.id}});
       //console.log("here",data[0].id);
        res.status(200).json({dt:data}) 
    }
    catch (err) {
        console.log(err);
    res.status(500).json({
      error: err,
    });
    }
}

exports.deleteExpense=async(req,res,next)=>{
  const id=req.params.id;
  try {
    const data=await Expense.destroy({where:{id,userId:req.user.id}})
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}

exports.addTotalExpense=async(req,res,next)=>{
  try{
  const{expenseAmount}=req.body;
  const user=await User.findOne({where:{id:req.user.id}});
  console.log(user);
  let total=0;
  if(user.expenseAmount){
    total=user.expenseAmount;
  }
  console.log(total)
  await user.update({totalExpense:total+expenseAmount});
  return res.status(202).json({ success: true, message: "totalExpense Updated" });
}
catch (err) {
  console.log(err);
  res.status(500).json({
    error: err,
  });
}
}
