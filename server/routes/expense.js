const path = require('path');

const express = require('express');

const expenseController = require('../Controllers/expense');
const userAuthentication=require('../middleware/auth');

const router = express.Router();

router.post('/expense/add-expense',userAuthentication.authenticate,expenseController.addExpense);

router.get('/expense/get-expenses',userAuthentication.authenticate,expenseController.getExpense);
router.delete('/expense/delete-expense/:id',userAuthentication.authenticate,expenseController.deleteExpense);

module.exports=router;