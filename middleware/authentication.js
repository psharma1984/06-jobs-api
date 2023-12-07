const user = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication Failed')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach user to job route
        req.user = { userId: payload.userId, name: payload.name }
        next()
    } catch (err) {
        throw new UnauthenticatedError('Authentication Failed')
    }
}

module.exports = auth