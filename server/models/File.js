const {Schema, model, ObjectId} = require("mongoose")

const File = new Schema({
    id: {type: ObjectId},
    name: {type:String, required: true},
    type: {type:String, required: true},
    accessLink: {type:String},    
    size: {type:Number, default: 0},
    path: {type:String, default: ''},
    date: {type:Date, default: Date.now()},
    status: {type:String, default: "NEW"},
    user: {type: ObjectId, ref:'User'},
    parent: {type: ObjectId, ref: 'File'},
    childs: [{type: ObjectId, ref: 'File'}]
})

module.exports = model('File', File)