const Sequelize=require('sequelize');

const sequelize=require('../util/database');
const { v4: uuidv4 } = require('uuid');

const ForgotPasswordRequest=sequelize.define('forgotPasswordRequest',{
    id:{
       type:Sequelize.UUID,
       allowNull:false,
       primaryKey:true,
       defaultValue:Sequelize.UUIDV4 
    },
    isactive:{
        type:Sequelize.BOOLEAN,
        allowNull:true
    },
    expiresby: Sequelize.DATE
})
module.exports=ForgotPasswordRequest;