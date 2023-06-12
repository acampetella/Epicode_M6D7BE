import express from "express";
import multer from 'multer';
import cloudinaryModule from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import verify from "../middlewares/verifyToken.js";

dotenv.config();
const cloudinary = cloudinaryModule.v2;

const uploads = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudPostsImagesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'epicodePostsImages',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.name
  }
});

const cloudPostsImagesUpload = multer({storage: cloudPostsImagesStorage});

const cloudAuthorsImagesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'epicodeAuthorsImages',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.name
  }
});

const cloudAuthorsImagesUpload = multer({storage: cloudAuthorsImagesStorage});

const internalPostsImagesStorage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, 'uploads/posts/images');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
  });
  
  const internalPostsImagesUpload = multer({storage: internalPostsImagesStorage});

  const internalAuthorsImagesStorage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, 'uploads/authors/images');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
  });
  
  const internalAuthorsImagesUpload = multer({storage: internalAuthorsImagesStorage});

  uploads.post('/blogPosts/internal/coverUpload', [internalPostsImagesUpload.single('img'), verify], 
    async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({
            img: `${url}/uploads/posts/images/${imgUrl}`
        })
    } catch (error) {
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
        
    }
  });

  uploads.post('/blogPosts/cloud/coverUpload', [cloudPostsImagesUpload.single('img'), verify], 
    async (req, res) => {
    try {
      res.status(200).json({img: req.file.path});
    } catch (error) {
      res.status(500).send({
        message: 'Upload file error',
        statusCode: 500
      })
    }
  });

  uploads.post('/authors/internal/avatarUpload', internalAuthorsImagesUpload.single('img'), 
    async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({
            img: `${url}/uploads/authors/images/${imgUrl}`
        })
    } catch (error) {
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
        
    }
  });

  uploads.post('/authors/cloud/avatarUpload', cloudAuthorsImagesUpload.single('img'), 
    async (req, res) => {
    try {
      res.status(200).json({img: req.file.path});
    } catch (error) {
      res.status(500).send({
        message: 'Upload file error',
        statusCode: 500
      })
    }
  });

  export default uploads;