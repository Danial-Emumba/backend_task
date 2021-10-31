const {Tasks} = require('../../models');
const fs = require('fs-extra')
const {Op} = require('sequelize')

module.exports.create_new_task = async (title, description, dueDate, userID) =>{
    return await Tasks.create({
        title, 
        description,
        dueDate, 
        userID , 
        completionStatus : "Not Started"})
}

module.exports.get_task_byId = async (uid, tid) =>{
    return await Tasks.findOne({
        where : {id : tid, userID : uid}
    })
}

module.exports.delete_task = async(id)=>{
    return await Tasks.destroy({where : {id}})
}

module.exports.move_task_attachment = async (fileName, userID,taskID) =>{
    return await fs.move(`uploads/${fileName}`, `uploads/${userID}/${taskID}/${fileName}`)       
}

module.exports.get_user_tasks = async (uid) =>{
    return await Tasks.findAll({where: {userID : uid}});
}

//tasks where due date has exceeded
module.exports.due_date_over  = async (uid) =>{
    const current_date = new Date().toISOString();
    return await Tasks.findAndCountAll({
        where : {
            userID : uid,
            dueDate : { [Op.gt] : current_date}
        }
    })
}

module.exports.update_task = async (userID, id, status) =>{
    const task = await Tasks.findOne({where : {userID , id}})
    task.completionStatus = status;
    return await task.save();
}