const User = require("../models/user");
const Expense=require("../models/expense");

exports.showLeaderboard=async(req,res,next)=>{
    try{
    const users=await User.findAll();
    const expenses=await Expense.findAll();
    const totalExpenses={};
    for(let i=0;i<expenses.length;i++){
        if(totalExpenses[expenses[i].userId]){
        totalExpenses[expenses[i].userId]+=expenses.expenseAmount;
        }
        else{
            totalExpenses[expenses[i].userId]=expenses.expenseAmount; 
        }
    }
    const leaderBoardDetails={};
    for(let i=0;i<users.length;i++){
        leaderBoardDetails.push({name:users[i].name,totalExpense:totalExpenses[users[i].id]});

    }
    const sortedLeaderboard = leaderboard.sort((a, b) => b.totalExpense - a.totalExpense);
    res.status(201).json(sortedLeaderboard);
}
catch(err){
    return res
    .status(404)
    .json({ error:err});
}

}