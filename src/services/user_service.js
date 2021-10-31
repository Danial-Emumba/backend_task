const {Users, verification_tokens} = require('../../models');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Email = require('email-templates');

module.exports.create_user = async (firstname, lastname, email ,password, auth_provider) =>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if(auth_provider.toLowerCase() == 'local'){
        return await Users.create({
            firstname, 
            lastname, 
            email,
            password : hashedPassword
        })
    }else{
        return await Users.create({
            firstname,
            lastname,
            email, 
            password : hashedPassword, 
            verified : true, 
            auth_provider
        })
    }
}

module.exports.create_verification_token = async (userID) =>{
    const emailToken =  await crypto.randomBytes(64).toString('hex');
    return await verification_tokens.create({
        userID, token : emailToken
    })
}

module.exports.find_user_by_email = async(email) =>{
    return await Users.findOne({where : {email}})
}

module.exports.find_user_by_id = async ( id ) =>{
    return await Users.findOne({where : {id}})
}

module.exports.send_email_to_user  = async( firstname, lastname , emailID, host, token ) =>{
    const user = {
        firstname, lastname , emailID, host, token
    }
    //create the email
    const email = await new Email({
        message : {
            from : "noreply@emumba.com"
        },
        send: true,
        transport: {
            host: 'smtp.mailtrap.io',
            port: 2525,
            ssl: false,
            tls: true,
            auth: {
              user: process.env.MAIL_TRAP_USER,
              pass: process.env.MAIL_TRAP_PASS 
            }
          }
    })
   return await email.send({
        template : 'welcome',
        message : {
            to : user.emailID
        },
        locals: user,
        open : false
    })
}

module.exports.send_password_reset_email = async (firstname,lastname,emailID,host,token, id) =>{
    const user = {
        firstname, lastname , emailID, host, token, id
    }
    const email = await new Email({
        message : {
            from : "noreply@emumba.com"
        },
        send: true,
        transport: {
            host: 'smtp.mailtrap.io',
            port: 2525,
            ssl: false,
            tls: true,
            auth: {
              user: process.env.MAIL_TRAP_USER,
              pass: process.env.MAIL_TRAP_PASS 
            }
          }
    })

    return await email.send({
        template : 'reset',
        message : {
            to : user.emailID
        },
        locals: user,
        open : false
    })
}

module.exports.user_password_verification = async (password, user_password) =>{
    return await bcrypt.compare(password, user_password)
}

module.exports.hash_password = async (password) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}