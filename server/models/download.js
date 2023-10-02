const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Download=sequelize.define('download',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        unique:true,
        primaryKey:true 
    },
    url:{
        type:Sequelize.STRING
    }
})

module.exports=Download;