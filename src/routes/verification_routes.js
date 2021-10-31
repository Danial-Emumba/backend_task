const router = require('express').Router();
const verification_controller = require('../controllers/verification_controller');
const passport = require('passport')

//email verification route
router.get('/verify-email', verification_controller.email_verification);

//password reset verification route
router.post('/reset-password/:uid/verify', verification_controller.password_reset_verification)


//simple display for login button
router.get('/', (req,res)=>{
    res.render('home.ejs')
})

//authentication route passed in the login button
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email'}));
//callback url to get response from  facebook
router.get('/facebook/callback', passport.authenticate('facebook' ,{
    successRedirect : "/api/v1/profile",
    failureRedirect : "/api/v1/failed"
}))

router.get('/profile', (req,res)=>{
    res.json({
        message : "Valid User Profile",
        user : req.user
    })
})

router.get('/failed' , (req,res)=>{
    res.send("invalid user")
}) 

module.exports = router;