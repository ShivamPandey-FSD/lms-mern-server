const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const Borrow = require('../models/borrow.model');
const calculateFine = require('../utils/calculateFine');

const recordBorrowedBooks = catchAsyncError(async (req, res, next) => {
 const { id } = req.params;
 const { email } = req.body;


 const book = await Book.findById(id);
 if (!book) {
  return next(new ErrorHandler("Book not found", 404));
 }

 const user = await User.findOne({ email });
 if (!user) {
  return next(new ErrorHandler("User not found", 404));
 }

 if (book.quantity === 0) {
  return next(new ErrorHandler("Book not available", 400));
 }

 const isAlreadyBorrowed = user.borrowedBooks.find((b) => b.bookId.toString() === id && b.returned === false)
 if (isAlreadyBorrowed) {
  return next(new ErrorHandler("You already borrowed this book", 400));
 }

 book.quantity -= 1;
 book.availability = book.quantity > 0;
 await book.save();

 user.borrowedBooks.push({
  bookId: book._id,
  bookTitle: book.title,
  borrowedDate: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 })
 await user.save();

 await Borrow.create({
  user: {
   id: user._id,
   name: user.name,
   email: user.email
  },
  price: book.price,
  book: book._id,
  borrowDate: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 });
 res.status(200).json({
  success: true,
  message: "Book borrowed"
 })
});

const returnBorrowedBook = catchAsyncError(async (req, res, next) => {
 const { id } = req.params;
 const { email } = req.body;


 const book = await Book.findById(id);
 if (!book) {
  return next(new ErrorHandler("Book not found", 404));
 }

 const user = await User.findOne({ email });
 if (!user) {
  return next(new ErrorHandler("User not found", 404));
 }

 const borrow = await Borrow.findOne({
  book: id,
  "user.email": email,
  returnDate: null
 });

 if (!borrow) {
  return next(new ErrorHandler("You have not borrowe this book", 400));
 }

 book.quantity += 1;
 book.availability = book.quantity > 0;
 await book.save();

 const borrowedBook = user.borrowedBooks.find((b) => b.bookId.toString() === id && b.returned === false);
 borrowedBook.returned = true;
 await user.save();

 borrow.returnDate = new Date();
 const fine = calculateFine(borrow.dueDate);
 borrow.fine = fine;
 await borrow.save();

 return res.status(200).json({
  success: true,
  message: fine > 0 ? `The book has been returned successfully. The total charges, including fine are ₹ ${book.price + fine}` : `The book has been returned successfully. The total charges are ₹ ${book.price}`
 })
});

const borrowedBooks = catchAsyncError(async (req, res, next) => {
 const borrowedBooks = await Borrow.findOne({ "user.id": req.user }).select("book borrowDate returnDate fine").populate("book", "title description");
 return res.status(200).json({
  success: true,
  borrowedBooks
 })
});

const getBorrowedBooksForAdmin = catchAsyncError(async (req, res, next) => {
 const borrowedBooks = await Borrow.find();
 return res.status(200).json({
  success: true,
  borrowedBooks
 })
});

module.exports = {
 borrowedBooks,
 recordBorrowedBooks,
 getBorrowedBooksForAdmin,
 returnBorrowedBook
}
