const path = require('path');
const fs=require('fs');
var cors=require('cors');
const helmet=require('helmet');
const morgan= require('morgan');
const express = require('express');
const bodyParser = require('body-parser');


const sequelize=require('./util/database')

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/orders');
const ForgotPasswordRequest=require('./models/forgotpassword');
const Download=require('./models/download');

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});


const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan('combined',{stream:accessLogStream}));


app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumFeaturesRoutes=require('./routes/premiumFeatures');
const resetPasswordRoutes=require('./routes/reset-password');

app.use('/expense',userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeaturesRoutes);
app.use('/password',resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);


sequelize
//.sync({force:true})
.sync()
.then(result=>{
   
   app.listen(process.env.PORT || 3000);
})
.catch(err=>console.log(err));