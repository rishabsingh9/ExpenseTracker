const path = require('path');
var cors=require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize=require('./util/database')


const app = express();

app.use(express.json());

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes=require('./routes/user');

app.use('/expense',userRoutes);


sequelize
//.sync({force:true})
.sync()
.then(result=>{
   
   app.listen(3000);
})
.catch(err=>console.log(err));