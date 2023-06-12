import bcrypt from "bcrypt"
import { Router } from "express"
import BlogAuthorModel from "../models/blogAuthorModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const login = Router();

login.post("/login", async (req, res) => {
    const user = await BlogAuthorModel.findOne({email:req.body.email});
    if (!user){
        return res.status(404).send({
            message:"User not found",
            statusCode: 404
        });
    }
    //confronto tra la password inviata bdall'utente con quella del DB
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send({
            message:"Password is wrong",
            statusCode: 400
        });
    }

    const token = jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        role: user.role,
        authType: "internal"
    }, process.env.SECRET_JWT_KEY, {
        expiresIn: '24h'
    });

    res.header('auth', token).status(200).send({
        message: "Login performed",
        statusCode: 200,
        token
    });
})

export default login;