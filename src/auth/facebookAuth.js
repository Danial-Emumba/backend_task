//passport requirements
const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy;

const user_service = require('../services/user_service')

module.exports = () =>{
    //configure facebook strategy to be used by passportJS
    passport.use(new facebookStrategy({
        clientID : process.env.FACEBOOK_APP_ID,
        clientSecret : process.env.FACEBOOK_APP_SECRET,
        callbackURL : 'http://localhost:5000/api/v1/facebook/callback',
        profileFields   : ['id','displayName','name','email']
    },
    //returns the profile data from facebook
    function(token, refreshToken, profile , done) {
        process.nextTick(async function () {
            const {first_name, last_name, email} = profile._json;
         try{
            const user = await user_service.find_user_by_email(profile._json.email);
            if(user){
                return done(null, user);
            }else{
                let random_password = (Math.random() + 1).toString(36).substring(4);
                const auth_provider = profile.provider;
                const new_user = await user_service.create_user(first_name,last_name,email,random_password, auth_provider);
                return done(null, new_user)
                
            }
         }catch (err){
             return done(err)
         }
        });
    }
    ));

    passport.serializeUser((user,done)=>{
        done(null, user);
    })
    ;
    passport.deserializeUser((user, done)=>{
        done(null, user)
    })

}