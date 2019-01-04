import mongoose from 'mongoose'
import {options} from '../extend'

const Schema = mongoose.Schema
const schema = new Schema({
  type: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  thumb: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  view: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 0   //0:未发布 1:已发布
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},options)

const model = mongoose.model('Article', schema)
export default model
