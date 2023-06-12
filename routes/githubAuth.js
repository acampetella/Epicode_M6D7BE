import express from 'express';
import passport from 'passport';
import {Strategy as GithubStrategy} from 'passport-github2';
import session from 'express-session';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

router.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET,
        resave: false,
        saveUninitialized: false
    })
);



router.use(passport.initialize());
router.use(passport.session());


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

passport.use(
    new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    })
);

router.get('/auth/github', passport.authenticate('github', {scope: ['user: email']}));
router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/success');
});

router.get('/success', (req, res) => {
    res.redirect(`${process.env.APP_BASE_URL}/success`);
});

router.get('/github/connectedUser', (req, res) => {
    if (req.user) {
        const token = jwt.sign({
            id: req.user.id,
            username: req.user.username,
            email: req.user._json.email,
            role: "role",
            authType: "github"
        }, process.env.SECRET_JWT_KEY, {
            expiresIn: '24h'
        });
        return res.send({
            statusCode: 200,
            token
        });
    }
    res.statusCode(404).send({
        message: "User not found",
        statusCode: 404
    });
})

export default router;

