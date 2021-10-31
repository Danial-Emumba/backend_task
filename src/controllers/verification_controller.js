const token_service = require('../services/token_verification_service');
const user_service = require('../services/user_service')
//email verification
module.exports.email_verification = async (req,res, next)=>{
    try{
        const verify_token = await token_service.get_token(req.query.token)
        if(!verify_token){
            return res.status(404).json({
                message : "Invalid Token"
            });
        }else{
           const user = await user_service.find_user_by_id(verify_token.userID)
           if(!user){
               return res.status(404).json({
                   message : "Invalid User"
               })
           }else{
               user.verified = true;
               await user.save()
               await verify_token.destroy()
               res.status(202).json({
                   message : "User email verified. Try logging into the system now"
               })
           }  
       }
    }catch(err){
        return res.status(400).json({
            message : "Unable to verify token",
            err
        })
    }
}

module.exports.password_reset_verification = async (req, res)=>{
    try{
        const verify_token = token_service.get_token(req.query.token) 
        if(!verify_token){
            return res.status(404).json({
                message : "Invalid Token"
            });
        }else{
            const {password} = req.body;
            const {uid} = req.params;
            const hashedPassword = await user_service.hash_password(password);
            const user = await user_service.find_user_by_id(uid)
            user.password = hashedPassword;
            await user.save();
            verify_token.destroy()
            return res.status(202).json({
                message : "Password Reset successful"
            })
        }
    }catch(err){
        console.log(err)
        return res.json({
            message : "Error resetting password : ",
            err
        })
    }
}

