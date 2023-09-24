const path = require('path');

const express = require('express');

const userController = require('../Controllers/user');

const router = express.Router();

router.post('/user/sign-up',userController.signUp);
router.post('/user/login',userController.login);

module.exports=router;