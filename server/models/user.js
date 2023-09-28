const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING,
        unique:true
        
    },
    password:{
        type:Sequelize.STRING
    },
    isPremiumUser:{
        type:Sequelize.BOOLEAN,
    },
    totalExpense:{
        type:Sequelize.INTEGER
    }
});

module.exports=User;