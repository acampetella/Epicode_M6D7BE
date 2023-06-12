import {body} from 'express-validator'

export const commentsPostsValidation = [
    body('commentText').notEmpty().isString().withMessage("commentText can't be empty and must be a string"),
    body('name').isString().withMessage("name must be a string")
]