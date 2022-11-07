const Router = require("express");
const User = require("../models/User")
const Role = require("../models/Role")
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

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, process.env.secretKey, {expiresIn: "3h"} )
}


//req.check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long")..matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
//req.check("password", "...").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");

router.post('/registration', 
    [
        check('email', "Uncorrect email").isEmail(),
        check('password', "Password must be longer than 5 and shorter than 12").isLength({min: 4, max: 10}),
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

        const hashPassword = await bcrypt.hash(password, 7)
        const activationLink = uuid.v4();

        // Добавляем роль новому пользователю (перед этим загружаем её из БД)
        const UserRole = await Role.findOne({value: "USER"})

        const user = new User({name, email, password: hashPassword, avatar, activationLink, roles: [UserRole.value]})
        await user.save()
        
        //Создаём на сервере папку для хранения файлов этого нового юзера
        await fileService.createDir(req, new File({user:user._id, name: ''}))

        //отправляем письмо клиенту со ссылкой активации учётной записи        
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);

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
            return res.status(404).json({message: "User not found"})            
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if(!isPassValid) {            
            return res.status(404).json({message: "Invalid password"})            
        }

        //const token = jwt.sign({id: user._id}, process.env.secretKey, {expiresIn: "3h"} )
        const token = generateAccessToken(user._id, user.roles)

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                isActivated: user.isActivated,
                avatar: user.avatar
            }
        })
        
    } catch (e) {
        console.log(e);
        res.send({message: 'Server Error'})        
    }
})


router.post('/forgot',     
    async (req, res) =>{
    try {
        const {email} = req.body

        const user = await User.findOne({email})
        if(!user) {                        
            return res.status(404).json({message: "User not found"})            
        }        

        const recoveryLink = uuid.v4();
        const recoveryTime = Date.now();

        user.recoveryLink=recoveryLink
        user.recoveryTime=recoveryTime
        await user.save()

        await mailService.sendRecoveryMail(email, `${process.env.CLIENT_URL}/forgot/${recoveryLink}`);

        return res.json({
            //message: "Email was send" + recoveryTime
            message: "Email was send"
        })
        
    } catch (e) {
        console.log(e);
        res.send({message: 'Server Error'})        
    }
})

router.post('/recovery',    
    async (req, res) => {
        try {
            
            const recoveryLink = req.body.link       
                 
            

            const user = await User.findOne({recoveryLink})
            if(!user){                                
                //console.log('Пользователь не найден');
                return res.status(404).json({message: "User not found"})
            }            

            if(user){
                // сколько минут прошло с момент запроса сброса пароля
                const spentTime = Math.floor(((Date.now() - user.recoveryTime) / (1000 * 60))) 
                // время жизни запроса - 1 час
                const timeLimit = 1 * 60
                
                if(spentTime > timeLimit){                                
                    //console.log('Время ссылки истекло, попробуйте ещё раз.');
                    return res.status(404).json({message: "Time has expired", user})
                }

                return res.json({                
                    message: "Enter new password (" + spentTime + ")",
                    user: {
                        id: user._id
                    }
                })
            }
            
        } catch (e) {
            console.log(e);
            res.send({message: 'Server Error'})            
        }    
})

router.post('/reset', 
    [        
        check('password', "Password must be longer than 5 and shorter than 12").isLength({min: 5, max: 12}),
    ],
    async (req, res) =>{
    try {     
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: "Uncorrect request", errors})
        }

        const {recoveryLink, password} = req.body
        const user = await User.findOne({recoveryLink})

        if(!user){            
            return res.status(400).json({message: `User was not found`})
        }

        const hashPassword = await bcrypt.hash(password, 8)
        user.password = hashPassword
        user.recoveryLink = ""
        user.recoveryTime = 0

        await user.save()        

        //тут ещё возможно записываем в логи (таблицу) уведомление об изменении пароля
        //где-то здесь ещё можно письмо клиенту об успешной обновлении пароля
        
        //await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);
              
        return res.json({
            message: "Password was updated"
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
                isActivated: user.isActivated,
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
        
        //res.json({message: "Profile activated"})
        return res.redirect(process.env.CLIENT_URL+'?user=activated');

    } catch (e) {
        //console.log(e);            
        next(e);            
    }
}
);

module.exports = router