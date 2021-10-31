//services
const user_service = require('../services/user_service');
const tasks_service = require('../services/tasks_service')

//create tasks for a user
module.exports.create_new_task = async(req,res)=>{
    const {uid} = req.params;
    const {title, description, dueDate} = req.body;
    try{
    const user = await user_service.find_user_by_id(uid);
    if(!user){
        return res.status(404).send("No user found in records");
    }
    else{
        const task = await tasks_service.create_new_task(title, description, dueDate,user.id)
        return res.status(201).json({
            message: `New task created by ${user.firstname}`,
            task
        })
    }
    }catch(err){
        res.status(400).json({
            message : "Error creating task",
            err
        })
    }
}

//delete task
module.exports.delete_task = async (req,res)=>{
    const {uid} = req.params;
    const {tid} = req.body
    try{
        const user = await user_service.find_user_by_id(uid, tid);
        if(!user) return res.status(400).send("No user found in database");
        else{
           const task = await tasks_service.get_task_byId(uid, tid)
           if(!task){
                return res.status(404).send("No such task exists");
           }else{
               if(task.userID == user.id){
                  await tasks_service.delete_task(task.id);
                  return res.status(200).json({
                      message:"Task deleted successfully",
                      task
                  })
               }
               else{
                   return res.status(400).send("Task does not belong to this user")
               }
           }
        }
    }catch(err){
        return res.status(400).json({
            message:"Unable to delete this task",
            err
        })
    }
}
//update user task
module.exports.update_task = async (req,res) =>{
    const {uid,tid} = req.params;
    const status = req.body.status;
    try{
        const task = await tasks_service.update_task(uid, tid, status);
        return res.json({
            task,
            message : "Task status updated"
        })
       
    }catch(err){
        return res.json({
            message :"Error updating task",
            err
        })
    }
}

//get all tasks for a user
module.exports.get_user_tasks = async (req,res)=>{
    const {uid} = req.params;
    try{
        // const user = await user_service.find_user_by_id(uid)
        const tasks = await tasks_service.get_user_tasks(uid)
        if(!tasks){
            return res.status(400).send("No user tasks in database");
        }
        else{
            return res.status(200).json({
                // message : 'User found',
                // totalTasks : user.tasks.length,
                // user
                tasks
            })
        }
    }catch(err){
        return res.status(400).json({
            err,
            message:"Error getting user"
        })
    }
}

//upload image to a task
module.exports.image_upload = async (req,res) =>{
    const {tid, uid} = req.params;
    try{
        const task = await tasks_service.get_task_byId(uid, tid)
        if(!task) return res.status(404).json({
            errorMessage : "Unable to find specified task"
        })
        else{
            if(req.file){
                task.attachments = req.file.filename;
                await task.save()
                .then(async()=>{
                    var fileName = req.file.filename;
                    await tasks_service.move_task_attachment(fileName, uid, tid)
                    res.status(201).json({
                        message : "New attachment uploaded",
                        file : fileName
                    })
                })
            }else{
                return res.json({
                    file : req.file,
                    error : "File not found"
                })
            }
        }
    }catch(err){
        // console.log(err)
        return res.status(400).json({
            message : "Error uploading image: ",
            err
        })
    }
}

//download image attached to the task
module.exports.download_task_attachment = async (req,res)=>{
    const {uid,tid} = req.params;
    try{
        const task = await tasks_service.get_task_byId(uid,tid)
        if(!task) return res.status(404).json({
            errorMessage : "Unable to find specified task"
        })
        else{
            const fileName = task.attachments;
            return res.download(`uploads/${uid}/${tid}/${fileName}`)
          
        }
    }catch(err){

       res.json({
           message : "Error downloading file: ",
           err
       })
    }
}

//get task reports
module.exports.get_task_reports = async (req,res) =>{
    const {uid} = req.params;
    try{
        const tasks = await tasks_service.due_date_over(uid);
        return res.json({
            tasks
        })
    }catch(err){
        return res.json({
            message : "Error getting report: ",
            err
        })
    }
}