const path = require('path');

const express = require('express');

const userController = require('../Controllers/user');

const router = express.Router();

router.post('/expense/add-user',userController.addUser);

router.get('/expense/get-users',userController.getUsers);

module.exports=router;