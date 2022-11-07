const {Schema, model, ObjectId} = require("mongoose")

const Role = new Schema({
    id: {type: ObjectId},
    value: {type: String, unique: true, default: "USER"}    
    
})

module.exports = model('Role', Role)