const {Schema, model, ObjectId} = require("mongoose")

const User = new Schema({
    id: {type: ObjectId},
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    avatar: {type: String},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},    
    recoveryLink: {type: String},
    recoveryTime: {type: String, default: 0},
    files: [{type: ObjectId, ref: 'File'}],
    roles: [{type: String, ref: 'Role'}]
    
})

module.exports = model('User', User)