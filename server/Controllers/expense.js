const Expense=require('../models/expense');

exports.addExpense=async(req,res,next)=>{
      const{expenseAmount,description,category}=req.body;  

    try {
        const data=await Expense.create({expenseAmount,description,category});
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
       const data=await Expense.findAll();
        res.status(200).json({dt:data}) 
    }
    catch (err) {
        console.log(err);
    res.status(500).json({
      error: err,
    });
    }
}
