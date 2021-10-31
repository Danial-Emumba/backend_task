const router = require('express').Router()
const taskController = require('../controllers/taskController')
const tokenValidation = require('../auth/tokenAuthentication')
const upload = require('../services/upload');

//create update delete or get tasks for a user
router.route('/:uid')
.post(tokenValidation, taskController.create_new_task)
.delete(taskController.delete_task)
.get(taskController.get_user_tasks)

//upload or download image for a task
router.route('/:uid/:tid')
.post(upload.single('file'), taskController.image_upload)
.get(taskController.download_task_attachment)
.patch(taskController.update_task)

router.get('/task/report/:uid', taskController.get_task_reports)


module.exports = router;