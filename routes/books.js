const express = require('express')
const router = express.Router()

const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/books')
router.route('/').post(createBook).get(getAllBooks)
router.route('/:id').get(getBook).delete(deleteBook).patch(updateBook)


module.exports = router