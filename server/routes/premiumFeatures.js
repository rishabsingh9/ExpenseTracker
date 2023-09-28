const path = require('path');

const express = require('express');

const premiumFeaturesController = require('../Controllers/premiumFeatures');
const userAuthentication=require('../middleware/auth');

const router = express.Router();

router.get('/premium/show-leaderboard',userAuthentication.authenticate,premiumFeaturesController.showLeaderboard);
module.exports=router;