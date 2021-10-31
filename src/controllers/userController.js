const jwt = require('jsonwebtoken')

//services
const user_service = require('../services/user_service');

//create new user
module.exports.register_user = async(req,res) =>{
    const {firstname, lastname, email, password} = req.body;
    try{
        const user = await user_service.find_user_by_email(email)
        if(user){
            return res.json({
                message:"This email already exists",
                email
            })
        }
        else{
            const user = await user_service.create_user(firstname,lastname, email, password, "local");

            const token = await user_service.create_verification_token(user.id)
            const host = process.env.HOST;
               
            const new_email = await user_service.send_email_to_user(firstname, lastname, email, host , token.token )  
            return res.status(201).json({message : "User registered! Verify email address to proceed further.."})           
        }
    }
    catch(err){
       return res.status(400).json({
            response: "Error creating user: ",
            error  : err.errors[0].message 
        })
    }
}

//user login
module.exports.user_login = async (req,res)=>{
    const {password, email} = req.body;

    try{
        const user = await user_service.find_user_by_email(email)
    if(!user){
        return res.status(404).json({
            message: "No user found with this email address",
            email
        })
    }
    else{
        const validPassword = await user_service.user_password_verification(password, user.password)
        if(!validPassword) return res.status(400).json({message :"Incorrect password"})
        else{
            if(user.verified){
                const token = jwt.sign({id : user.id}, process.env.TOKEN_SECRET, {
                    expiresIn : '1h'
                });
                return res.header('auth-token', token).json({token, userid: user.id, message : "Login Successful"});  
                
            }else{
                return res.status(401).json({
                    message : "Verify email address before logging into the system",
                  
                })
            }
        }
    }
    }catch(err){
        return res.status(400).json({
            response : "Error logging in user: ",
            error : err.errors[0].message
        })
    }
}

//user password reset controller
module.exports.forgot_password = async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await user_service.find_user_by_email(email);
        if(user){
            if(user.verified){
                if(user.auth_provider.toLowerCase == 'local'){
                    const token = await user_service.create_verification_token(user.id);
                    const host = process.env.HOST;
                    await user_service.send_password_reset_email(user.firstname, user.lastname, user.email, host, token.token, user.id)
                    return res.json({
                        message : 'Check your email for a password-reset link'
                    })
                }else{
                    return res.json({
                        message : "Password reset not available for OAuth Users."
                    })
                }
            }else{
                return res.json({
                    message :"Password reset option available for verified users only, Please verify your account before making a change password request."
                })
            }
        }else{
            return res.status(404).json({
                message : "No user exists",
                uid
            })
        }
    }catch(err){
        return res.json({
            message : "Error occured",
            err
        })
    }
}