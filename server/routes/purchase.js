const path = require('path');

const express = require('express');

const purchaseController = require('../Controllers/purchase');
const userAuthentication=require('../middleware/auth');

const router = express.Router();
router.get('/purchase/premium-membership',userAuthentication.authenticate,purchaseController.purchasePremium);
router.post('/purchase/update-transaction-status',userAuthentication.authenticate,purchaseController.updateTransaction);

module.exports=router;