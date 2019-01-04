import mongoose from 'mongoose'
import {options} from '../extend'

const Schema = mongoose.Schema
const schema = new Schema({
  content: {
    type: String,
    default: ''
  },
  reply: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  article:{
    type: Schema.Types.ObjectId,
    ref: 'Article',
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

const model =  mongoose.model('Comment', schema)
export default model
