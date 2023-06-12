import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const key = req.header('auth');

    if (!key) {
        return res.status(401).send({
            errorType: 'Token not found',
            statusCode: 401,
            message: 'Endpoint needs access token'
        });
    }

    const items = key.split(" ");
    if (items.length !== 2) {
        return res.status(401).send({
            errorType: 'Token not valid',
            statusCode: 401,
            message: 'Token format error'
        });
    }

    const word = items[0];
    if (word !== "BEARER") {
        return res.status(401).send({
            errorType: 'Token not valid',
            statusCode: 401,
            message: 'Token format error'
        }); 
    }

    try {
        const token = items[1];
        req.user = jwt.verify(token, process.env.SECRET_JWT_KEY);
        next();
    } catch(error) {
        res.status(403).send({
            errorType: 'Token Error',
            statusCode: 403,
            message: 'token not valide or expires'
        });
    }
}

export default verifyToken;