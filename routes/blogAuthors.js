import express from 'express'
import BlogAuthorsModel from '../models/blogAuthorModel.js'
import bcrypt from 'bcrypt';
import verify from "../middlewares/verifyToken.js";

const authors = express.Router()

authors.get('/authors', verify, async (req, res) => {
    const { page = 1, pageSize = 3} = req.query;
    try {
        const authors = await BlogAuthorsModel.find()
        .limit(pageSize)
        .skip((page - 1) * pageSize);

        const authorsCount = await BlogAuthorsModel.count();
        res.status(200).send({
            count: authorsCount,
            currentPage: Number(page),
            totalPages: Math.ceil(authorsCount / Number(pageSize)),
            statusCode: 200,
            authors
        });
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            statusCode: 500
        })
    }
})

authors.get('/authors/:id', verify, async (req, res) => {
    try {
        const {id} = req.params;
        const authorExists = await BlogAuthorsModel.findOne({_id: id})
        if (!authorExists) {
            return res.status(404).send({
                message: `author by id ${id} not found`,
                statusCode: 404
            })
        }
        res.status(200).send({
            statusCode: 200,
            authorExists
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            statusCode: 500
        })
    }
})

authors.get('/authors/byEmail/:email', verify, async (req, res) => {
    try {
        const {email} = req.params;
        const authorExists = await BlogAuthorsModel.findOne({email: email});
        if (!authorExists) {
            return res.status(404).send({
                message: `author not found`,
                statusCode: 404
            })
        }
        res.status(200).send({
            statusCode: 200,
            authorExists
        });
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            statusCode: 500
        })
    }
})

authors.post('/authors', async (req, res) => {
    try {
        const authorExists = await BlogAuthorsModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
        if (authorExists) {
            return res.status(409).send({
                message: 'existing author',
                statusCode: 409
            })
        }
        const password = req.body.password;
        //definiamo l'algoritmo di codifica
        const genSalt = await bcrypt.genSalt(10);
        //creiamo la password criptata
        const hashedPassword = await bcrypt.hash(password, genSalt);
        const author = new BlogAuthorsModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthDate: req.body.birthDate,
            avatar: req.body.avatar,
            password: hashedPassword
        });
        const newAuthor = await author.save()
        res.status(201).send({
            message: 'author created',
            payload: newAuthor,
            statusCode: 201
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            statusCode: 500
        })      
    }
})

authors.patch('/authors/:id', verify, async (req, res) => {
    try {
        const {id} = req.params;
        const authorExists = await BlogAuthorsModel.findOne({_id: id})
        if (!authorExists) {
            return res.status(404).send({
                message: `author by id ${id} not found`,
                statusCode: 404
            })
        }
        const dataUpdated = req.body;
        const options = {new: true}
        const result = await BlogAuthorsModel.findByIdAndUpdate(id, dataUpdated, options)
        res.status(200).send({
            message: `author by id ${id} modified`,
            payload: result,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            statusCode: 500
        })
    }
})

authors.delete('/authors/:id', verify, async (req, res) => {
    try {
        const {id} = req.params;
        const authorExists = await BlogAuthorsModel.findByIdAndDelete(id);
        if (!authorExists) {
            return res.status(404).send({
                message: `author by id ${id} not found`,
                statusCode: 404
            })
        }
        res.status(200).send({
            message: `author by id ${id} deleted`,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            statusCode: 500
        })
    }
})

export default authors