const {Schema, model, Types} = require('mongoose')


const schema = new Schema({
  text: {type:String, require: true},
  date: {type: Date, default: Date.now, require: true},
  done: {type: Boolean, default: false},
  owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Task', schema)