const express = require('express');
const router = express.Router();
const {Signup,Login,loginWithToken, order, resetPassword, logOut} = require('../Controllers/userController');
const authController = require('../Controllers/authController');


router.post('/Signup',Signup)
router.post('/Login',Login)
router.get('/LoginWithToken',authController,loginWithToken);
router.patch('/resetPassword',resetPassword)
router.get('/order',authController,order);
router.get('/logout',logOut);

module.exports = router;
