const Router = require("express");
const User = require("../models/User")
const bcrypt = require("bcrypt")
require('dotenv').config()
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = new Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')

const uuid = require('uuid')
const mailService = require('../services/mailService')


router.post('/registration', 
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', "Password must be longer than 3 and shorter than 12").isLength({min: 3, max: 12}),
    ],
    async (req, res) =>{
    try {
        // console.log(req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: "Uncorrect request", errors})
        }

        const {name, email, password, avatar} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            return res.status(400).json({message: `User with email ${email} already exist`})
        }

        const hashPassword = await bcrypt.hash(password, 8)
        const activationLink = uuid.v4();

        const user = new User({name, email, password: hashPassword, avatar, activationLink})
        await user.save()
        await fileService.createDir(req, new File({user:user._id, name: ''}))

        //где-то здесь ещё отправляем письмо клиенту со ссылкой активации учётной записи
        
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);

        //console.log("EMAIL-SENT" + password);

        //return res.json({message: "User was created"})
        return res.json({
            message: "User was created",
            user: {                
                name: user.name,
                email: user.email                
            }
        })
        
    } catch (e) {
        console.log(e);
        res.send({message: 'Server Error'})        
    }
})

router.post('/login',     
    async (req, res) =>{
    try {
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user) {            
            //return res.status(404).json({message: "User not found"})            
            return res.status(404).json({message: "User not found"})            
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if(!isPassValid) {            
            return res.status(404).json({message: "Invalid password"})            
        }

        const token = jwt.sign({id: user._id}, process.env.secretKey, {expiresIn: "1h"} )
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        })
        
    } catch (e) {
        console.log(e);
        res.send({message: 'Server Error'})        
    }
})

router.get('/auth', authMiddleware,    
    async (req, res) =>{
    try {
        const user = await User.findOne({_id: req.user.id})
        const token = jwt.sign({id: user._id}, process.env.secretKey, {expiresIn: "2h"} )
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        })
        
    } catch (e) {
        console.log(e);
        res.send({message: 'Server Error'})        
    }
})

router.get('/activate/:link', 
    async (req, res) => {
    try {
        //console.log("Tryind to activate link");
        const activationLink = req.params.link
        //await userService.activate(activationLink);
        const user = await User.findOne({activationLink})
        if(!user){
            //throw ApiError.BadRequest('Некорректная ссылка активации')
            console.log('Некорректная ссылка активации');
        }
        user.isActivated = true;
        await user.save();

        return res.redirect(process.env.CLIENT_URL);

    } catch (e) {
        //console.log(e);            
        next(e);            
    }
}
);

module.exports = router