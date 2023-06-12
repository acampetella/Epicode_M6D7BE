import express from 'express';
import {createTransport} from 'nodemailer'
import dotenv from 'dotenv';
import verify from "../middlewares/verifyToken.js";

dotenv.config();

const mails = express.Router();

const transport = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

mails.post('/sendMail', verify, async (req, res) => {

    const {destination, subject, message} = req.body;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destination,
        subject: subject,
        text: message
    }

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({
                message: 'Mail not send',
                statusCode: 500
            });
        } else {
            res.status(200).send({
                message: 'Mail sends correctly',
                statusCode: 200
            });
        }
    });

});

export default mails;