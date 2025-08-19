const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//all paths inside here prefixed with /travelBlog

router.post("/login", authController.authLogin)
router.post("/register", authController.authRegister)
router.post("/logout", authController.authLogout)

router.get("/", authController.getInitialPage)
router.get("/register", authController.getRegisterPage)
router.get("/login", authController.getLoginPage)


module.exports = router;