//importiamo le librerie express e mongoose
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import blogAuthorsRoute from './routes/blogAuthors.js';
import blogPostsRoute from './routes/blogPosts.js';
import uploadsRoute from './routes/fileUpload.js';
import mailsRoute from './routes/sendEmails.js';
import loginRoute from './routes/login.js';
import githubRoute from './routes/githubAuth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: process.env.APP_BASE_URL,
    credentials: true
};

const app = express();

app.use('/uploads/posts/images', express.static(path.join(__dirname, './uploads/posts/images')));
app.use('/uploads/authors/images', express.static(path.join(__dirname, './uploads/authors/images')));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/', blogAuthorsRoute);
app.use('/', blogPostsRoute);
app.use('/', uploadsRoute);
app.use('/', mailsRoute);
app.use('/', loginRoute);
app.use('/', githubRoute);

//metodo di connessione al DB
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//salviamo la connessione al DB in una variabile
const db = mongoose.connection;

//definizione dei listener relativi al DB
db.on('error', console.error.bind(console, 'DB connection error')); //listener degli errori
db.once('open', ()=>{console.log('DB connected')}); //listener della connessione al DB

app.listen(process.env.SERVER_PORT, () => console.log('Server running'));