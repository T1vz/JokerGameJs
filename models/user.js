const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    rate: {type: Number, default: 100}
})

module.exports = model('User', schema)