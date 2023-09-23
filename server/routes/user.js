const path = require('path');

const express = require('express');

const userController = require('../Controllers/user');

const router = express.Router();

router.post('/expense/add-user',userController.addUser);

module.exports=router;