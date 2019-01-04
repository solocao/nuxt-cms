import mongoose from 'mongoose'
import {options} from '../extend'

const Schema = mongoose.Schema
const schema = new Schema({
  name: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},options)

const model = mongoose.model('Tag', schema)
export default model
