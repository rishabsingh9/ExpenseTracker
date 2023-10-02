const  AWS  = require('aws-sdk');
const Expense=require('../models/expense');
const User = require('../models/user');
const sequelize=require('../util/database');
const Download=require('../models/download');

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

function uploadToS3(data,filename){
const BUCKET_NAME='myexpensetrackingapp'
const IAM_USER_KEY=process.env.USER_KEY;
console.log("iamuser",IAM_USER_KEY);
const IAM_USER_SECRET=process.env.USER_SECRET;

let s3Bucket=new AWS.S3({
  accessKeyId:IAM_USER_KEY,
  secretAccessKey:IAM_USER_SECRET
})


  var params={
    Bucket:BUCKET_NAME,
    Key:filename,
    Body:data,
    ACL:'public-read'
  }
  return new Promise((resolve,reject)=>{
    s3Bucket.upload(params,(err,s3response)=>{
      if(err){
        console.log("something went wrong ",err);
        reject(err);
      }
      else{
        //console.log("Successful ",s3response)
        resolve(s3response.Location);
      }
    })
  })
  
}

exports.downloadExpense=async(req,res,next)=>{
  try {
    const expenses=await req.user.getExpenses();
    //console.log(expenses);
  const userid=req.user.id;
  
    const stringifiedExpenses=JSON.stringify(expenses);
    const filename=`Expense.txt ${userid}/${new Date()}.txt`;
    const fileUrl=await uploadToS3(stringifiedExpenses,filename);
    const data=await Download.create({url:fileUrl,userId:req.user.id});


    res.status(200).json({fileUrl,success:true})
  } catch (error) {
    res.status(500).json({fileUrl:'',success:false,error:error});
  }
}


// exports.deleteExpense=async(req,res,next)=>{
//   const id=req.params.id;
//   try {
//     const data=await Expense.destroy({where:{id,userId:req.user.id}})
//     console.log("data",data);
//     const user=await User.findOne({where:{id:req.user.id}});
//     await user.update({totalExpense:totalExpense-data.expenseAmount});
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: err,
//     });
//   }
// }


exports.getExpense=async(req,res,next)=>{
  let ITEMS_PER_PAGE=Number(req.query.limit);
  const page=+req.query.page ||1;
  try {
    const data=await Expense.findAll({where:{userId:req.user.id},offset:(page-1)*ITEMS_PER_PAGE,limit:ITEMS_PER_PAGE});
    const total=await Expense.count({where:{userId:req.user.id}});
    console.log(total,"total");
    res.status(201).json({
      expenses:data,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page<total,
      nextPage:page+1,
      hasPreviousPage:page>1,
      previousPage:page-1,
      lastPage:Math.ceil(total/ITEMS_PER_PAGE)
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,error:error});
  }
}
exports.deleteExpense = async (req, res, next) => {
  let transaction;
  const id = req.params.id;

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    // Find and delete the expense
    const expense = await Expense.findOne({ where: { id, userId: req.user.id }, transaction });
    console.log("expense",expense);
    console.log("amount",expense.expenseAmount);
    if (!expense) {
      // Handle case where the expense does not exist or does not belong to the user
      return res.status(404).json({ error: "Expense not found" });
    }

    // Store the expense amount before deleting it
    const deletedExpenseAmount = Number(expense.expenseAmount);

    await expense.destroy({ transaction });

    // Find the user
    const user = await User.findOne({ where: { id: req.user.id }, transaction });
    const expenses=Number(user.totalExpense);

    // Calculate the new total expense (subtract the deleted expense amount)
    // const expenses = await Expense.sum("expenseAmount", { where: { userId: req.user.id }, transaction });
    const newTotalExpense = (expenses || 0) - deletedExpenseAmount;

    // Update the user's total expense
    await user.update({ totalExpense: newTotalExpense }, { transaction });

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);

    // Rollback the transaction in case of an error
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({ error: err });
  }
};

// exports.addTotalExpense=async(req,res,next)=>{
//   try{
//   const{expenseAmount}=req.body;
//   const user=await User.findOne({where:{id:req.user.id}});
//   console.log(user);
//   let total=0;
//   if(user.expenseAmount){
//     total=user.expenseAmount;
//   }
//   console.log(total)
//   await user.update({totalExpense:total+expenseAmount});
//   return res.status(202).json({ success: true, message: "totalExpense Updated" });
// }
// catch (err) {
//   console.log(err);
//   res.status(500).json({
//     error: err,
//   });
// }
// }

exports.addTotalExpense = async (req, res, next) => {
  let transaction; // Declare a variable to hold the transaction

  try {
    // Start a transaction
    transaction = await sequelize.transaction();

    const { expenseAmount } = req.body;

    // Find the user within the transaction
    const user = await User.findOne({ where: { id: req.user.id }, transaction });

    let total = 0;

    // Use the correct column name for total expenses, e.g., 'totalExpense'
    if (user.totalExpense) {
      total = Number(user.totalExpense);
    }

    // Update the user's total expense within the transaction
    await user.update({ totalExpense: total + Number(expenseAmount) }, { transaction });

    // Commit the transaction
    await transaction.commit();

    return res.status(202).json({ success: true, message: "totalExpense Updated" });
  } catch (err) {
    console.log(err);

    // Rollback the transaction in case of an error
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({
      error: err,
    });
  }
};

