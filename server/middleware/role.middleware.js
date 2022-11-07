const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (roles){
    return function(req, res, next){
        if(req.method === 'OPTIONS'){
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return res.status(401).json({message: 'Auth error'})
            }
            
            //const decoded = jwt.verify(token, process.env.secretKey)
            const {roles: userRoles} = jwt.verify(token, process.env.secretKey)
            let hasRole = false
            userRoles.forEach(role => {
                if(roles.includes(role)){
                    hasRole = true
                }
            })
            if(!hasRole){
                return res.status(401).json({message: 'Not enough right'})   
            }

            //req.user = decoded
            next()
            
        } catch (error) {
            return res.status(401).json({message: 'Auth error'})
            
        }
    }
}