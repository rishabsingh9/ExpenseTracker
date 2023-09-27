const path = require('path');
var cors=require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize=require('./util/database')

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/orders');


const app = express();

app.use(express.json());

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumFeaturesRoutes=require('./routes/premiumFeatures');

app.use('/expense',userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeaturesRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize
//.sync({force:true})
.sync()
.then(result=>{
   
   app.listen(3000);
})
.catch(err=>console.log(err));