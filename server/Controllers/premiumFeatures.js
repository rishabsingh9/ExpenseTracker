const User = require("../models/user");
const Expense=require("../models/expense");
const sequelize = require("../util/database");

exports.showLeaderboard=async(req,res,next)=>{
    try{
        const leaderboardOfUsers=await User.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('Expenses.expenseAmount')),'totalExpense']],
            include:[
                {
                    model:Expense,
                    attributes:[]
                }
            ],
            group:['user.id'],
            order:[['totalExpense','DESC']]
        })
        res.status(200).json(leaderboardOfUsers);
    // const users=await User.findAll();
    // const expenses=await Expense.findAll();
    // const totalExpenses=[];
    // for(let i=0;i<expenses.length;i++){
    //     if(totalExpenses[expenses[i].userId]){
    //     totalExpenses[expenses[i].userId]+=expenses[i].expenseAmount;
    //     }
    //     else{
    //         totalExpenses[expenses[i].userId]=expenses[i].expenseAmount; 
    //     }
    // }
    // const leaderBoardDetails=[];
    // for(let i=0;i<users.length;i++){
    //     leaderBoardDetails.push({name:users[i].name,totalExpense:totalExpenses[users[i].id] || 0});

    // }
    // const sortedLeaderboard = leaderBoardDetails.sort((a, b) => b.totalExpense - a.totalExpense);
    // console.log(sortedLeaderboard);
    // res.status(201).json(sortedLeaderboard);
}
catch(err){
    console.log('why');
    return res
    .status(404)
    .json({ error:err});
}

}