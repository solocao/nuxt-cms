import mongoose from 'mongoose'
import {options} from '../extend'

const Schema = mongoose.Schema
const schema = new Schema({
  role: {
    type: String,
    default: '用户'
  },
  avatar: {
    type: String,
    default: '/icon.png'
  },
  username: {
    type: String,
    default: '',
    index: true
  },
  password: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},options)

//statics
schema.statics = {
  findByRole:function(role, cb){
    return this.find({ role }, cb)
  }
}

//methods
schema.methods = {
  sayHi:function(){
    console.log(`Hi, welcome ${this.name}`)
  }
}

//query
schema.query = {
  byName:function(name){
    return this.where({ username: new RegExp(name, 'i') })
  }
}

const model = mongoose.model('User', schema)
export default model
