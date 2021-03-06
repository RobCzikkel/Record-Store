/***************************************************************************************************************************************
Authenticators for protecting endpoints:
    1. for cookies
    2. for headers
***************************************************************************************************************************************/


jwt = require('jsonwebtoken')

const AuthFromCookie = async(req,res,next) => {
    const token = req.cookies.jwt;
    if (typeof token !== 'undefined') {
        let secret = process.env.JWT_SECRET;

        try {
            const user = jwt.verify(token,secret,{algorithm:'HS256'});
            req.user = user;
            next()
        } catch (error) {
            next(error)
        }
    } else {
        res.status(401).json({"Error": "Not authorized"})
    }
};

const AuthFromHeaders = async(req, res, next) => {
    if (typeof req.headers.authorization !== 'undefined') {

        let token = req.headers.authorization.split(' ')[1];
        let secret = process.env.TOKEN_SECRET;

        try {
            const user = jwt.verify(token,secret,{algorithm:'HS256'});
            req.user = user;
            next()
        } catch (error) {
            next(error)
        }
    } else {
        res.status(401).json({'error': 'Not authorized'});
    }
}

const AdminAuth = async(req,res,next) => {
    const role = req.user.role
    if (role === 'admin') {
        next()
    } else {
        res.status(401).json({"Error": "User must be authorized as an Administrator to access this endpoint"})
    }
}

module.exports = {
    AuthFromCookie,
    AuthFromHeaders,
    AdminAuth
}