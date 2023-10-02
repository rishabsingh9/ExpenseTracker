const path = require('path');

const express = require('express');

const resetpasswordController = require('../Controllers/reset-password');
const userAuthentication=require('../middleware/auth');

const router = express.Router();


router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/forgotpassword',resetpasswordController.forgotpassword )


module.exports=router;