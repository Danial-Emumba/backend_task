const jwt = require('jsonwebtoken');

const tokenValidation = async(req,res, next) =>{
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send("Access Denied");
    }
    try{
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err){
        return res.status(400).send("token invalid")
    }
}

module.exports = tokenValidation;