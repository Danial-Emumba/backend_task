const {verification_tokens} = require('../../models');

module.exports.get_token = async (token) =>{
    return await verification_tokens.findOne({where : {token}});
}

