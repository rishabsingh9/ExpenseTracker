const Expense=require('../models/expense');

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
