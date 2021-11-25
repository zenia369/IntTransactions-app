const {Schema, model} = require('mongoose');



const schema = new Schema({
    bank: String,
    bankNumber: String,
    name: String,
    value: String,
    changes: Array,
    transaction: Array,
})


module.exports = model('account', schema)