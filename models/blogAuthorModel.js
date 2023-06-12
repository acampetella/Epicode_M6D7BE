import {Schema, model} from 'mongoose'

const BlogAuthorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    birthDate: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: false,
        default: 'user'
    }
}, {
    timestamps: true, strict: true
})

const BlogAuthorsModel = model('BlogAuthorModel', BlogAuthorSchema, 'blogAuthors')
export default BlogAuthorsModel