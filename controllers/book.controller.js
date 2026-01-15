const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const Book = require('../models/book.model');
const User = require('../models/user.model');

const addBook = catchAsyncError(async (req, res, next) => {
 const {title, author, description, price, quantity} = req.body;

 if (!title || !author || !description || !price || !quantity) {
  return next(new ErrorHandler("All fields are mandatory", 400));
 }

 const book = await Book.create({
  title,
  author,
  description,
  price,
  quantity
 });

 console.log(book)

 res.status(201).json({
  success: true,
  message: "Book added successfully",
  book
 });
});

const deleteBook = catchAsyncError(async (req, res, next) => {
 const {id} = req.params;
 const book = await Book.findById(id);

 if (!book) {
  return next(new ErrorHandler("Book not found", 404));
 }

 await book.deleteOne();
 return res.status(200).json({
  success: true,
  message: "Book deleted successfully"
 })
});

const getAllBooks = catchAsyncError(async (req, res, next) => {
 const books = await Book.find();
 
 return res.status(200).json({
  success: true,
  books
 });
});

module.exports = {
 addBook,
 deleteBook,
 getAllBooks
}
