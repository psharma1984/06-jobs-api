const Book = require('../models/Book')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllBooks = async (req, res) => {
    res.send('Get all books')
}

const getBook = async (req, res) => {
    res.send('Get sngle book')
}

const createBook = async (req, res) => {
    req.body.createdBy = req.user.userId
    const book = await Book.create(req.body)
    res.status(StatusCodes.CREATED).json({ book })
}

const updateBook = async (req, res) => {
    res.send('updaete book')
}

const deleteBook = async (req, res) => {
    res.send('deletee book')
}

module.exports = {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
}