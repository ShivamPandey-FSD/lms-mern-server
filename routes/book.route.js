const express = require('express');
const {isAuthenticated, isAuthorized} = require('../middlewares/auth.middleware');
const { addBook, deleteBook, getAllBooks } = require('../controllers/book.controller');

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.get("/allBooks", isAuthenticated, getAllBooks);

module.exports = router;