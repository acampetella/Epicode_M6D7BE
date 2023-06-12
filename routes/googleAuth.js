import express from 'express';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();


passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        return done(null, profile);
    })
);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/success');
});

router.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Accesso consentito');
    }
    res.redirect('/auth/google');
});

export default router;

