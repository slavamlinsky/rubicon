const fs = require('fs')
const File = require('../models/File')
require('dotenv').config()

class FileService {
   

    createDir(req, file){
        console.log(file.user);

        // let filePath = `${process.env.filePath}\\${file.user}`;
        
        // if (typeof file.path !== 'undefined') {
        //     filePath = `${filePath}\\${file.path}`
        // }                
        //const filePath = `${process.env.filePath}\\${file.user}\\${file.path}`
        
        const filePath = this.getPath(req, file)
        //console.log(filePath);

        return new Promise(((resolve, reject) => {
            try {
                if(!fs.existsSync(filePath)){
                    console.log("Создаём папку" + filePath);
                    //fs.mkdirSync(filePath)
                    fs.mkdirSync(filePath, { recursive: true });
                    return resolve({message: 'File was created'})
                } else {
                    return reject({message: 'File Already Exist'})
                }

                
            } catch (e) {
                return reject({message: 'File Error'})
                
            }
        }))
    }

    deleteFile(req, file){
        const path = this.getPath(req, file)
        if(file.type === 'dir'){
            fs.rmdirSync(path)
        }
        else{
            fs.unlinkSync(path)
        }
    }

    getPath(req, file){
        console.log(req.filePath + '/' + file.user + '/' + file.path)
        
        return req.filePath + '/' + file.user + '/' + file.path
        
    }

}

module.exports = new FileService()