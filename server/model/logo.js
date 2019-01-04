import mongoose from 'mongoose'
import {options} from '../extend'

const Schema = mongoose.Schema
const schema = new Schema({
  name: {
    type: String,
    default: ''
  },
  imgPath: {
    type: String,
    default: ''
  },
  link: {
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

const model = mongoose.model('Logo', schema)
export default model
