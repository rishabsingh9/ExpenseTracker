const Sequelize=require('sequelize');

const sequelize=new Sequelize('expense-tracker','root','Setdosa@23',{
    dialect:'mysql',
    host:'localhost'
})
module.exports=sequelize;