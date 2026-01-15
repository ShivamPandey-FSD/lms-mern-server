const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const Book = require('../models/book.model');
const User = require('../models/user.model');

const addBook = catchAsyncError(async (req, res, next) => {});
const deleteBook = catchAsyncError(async (req, res, next) => {});
const getAllBooks = catchAsyncError(async (req, res, next) => {});

module.exports = {
 addBook,
 deleteBook,
 getAllBooks
}
