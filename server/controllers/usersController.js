const User = require('../models/User');
require('dotenv').config()
const path = require ('path')

class UsersController{    

    async getUsers(req, res){
        try {
            const {sort} = req.query
            let users
            switch (sort){
                case 'name':
                    users = await User.find().sort({name:1})
                    break;
                case 'email':
                    users = await User.find().sort({email:1})
                    break;
                case 'date':
                    users = await User.find().sort({date:1})
                    break;
                default:
                    //users = await User.find({isActivated: true})
                    users = await User.find()
                    break;
            }

            
            return res.json(users)

        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Can not get users"})
            
        }
    }
    

    // async deleteUser(req,res){
    //     try {
    //         const file = await File.findOne({_id: req.query.id, user: req.user.id})
    //         if(!file){
    //             return res.status(400).json({message: "File not found"}) 
    //         }
    //             fileService.deleteFile(req, file)
    //             await file.remove()
    //             if(file.type==='dir')
    //             {
    //                 return res.json({message: "Dir was deleted"})
    //             }
    //             else {
    //                 return res.json({message: "File was deleted"})
    //             }
                
         
            
    //     } catch (e) {
    //         console.log(e);
    //         return res.status(400).json({message: "Dir is not empty"})
    //     }
    // }

    // async searchUser(req, res){
    //     try {
    //         const searchName = req.query.search
    //         let files = await File.find({user: req.user.id})
    //         files = files.filter(file => (file.name).toLowerCase().includes(searchName))
    //         return res.json(files)

            
    //     } catch (e) {
    //         console.log(e);
    //         return res.status(400).json({message: "Searching error"})
    //     }
    // }
    
}



module.exports = new UsersController()