const multer = require('multer');


const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/') 
    },
    filename: (req, file ,cb)=>{
        cb(null,Date.now() + '-' +file.originalname)
    }
})

const upload = multer({
    storage:fileStorageEngine,
    fileFilter : function(req,file,cb){
        if(
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/svg+xml'
            
        ){
            cb(null, true)
        }else{
            console.log("file type must be jpg or png")
            cb(null,false)
        }
    }
})

module.exports = upload

