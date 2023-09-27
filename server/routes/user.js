const path = require('path');

const express = require('express');

const userController = require('../Controllers/user');
const userAuthentication=require('../middleware/auth');

const router = express.Router();

router.post('/user/sign-up',userController.signUp);
router.post('/user/login',userController.login);
router.get('/user/get-user',userAuthentication.authenticate,userController.getUser);

module.exports=router;