const router = require('express').Router()
const userController = require('../controllers/userController')


//Register new user
router.post('/register', userController.register_user);

//user login
router.post('/login', userController.user_login)

//forgot password
router.post('/forgot-password', userController.forgot_password)


module.exports = router;