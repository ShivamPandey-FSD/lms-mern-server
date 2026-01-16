const express = require('express');
const {isAuthenticated, isAuthorized} = require('../middlewares/auth.middleware');
const { borrowedBooks, recordBorrowedBooks, getBorrowedBooksForAdmin, returnBorrowedBook } = require('../controllers/borrow.controller');

const router = express.Router();

router.post("/record-borrowed-book/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBooks);
router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin);
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);
router.patch("/return-borrowed-book/:id", isAuthenticated, isAuthorized("Admin"), returnBorrowedBook);

module.exports = router;