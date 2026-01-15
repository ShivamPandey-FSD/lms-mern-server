const express = require('express');
const {isAuthenticated} = require('../middlewares/auth.middleware');
const { addBook, deleteBook, getAllBooks } = require('../controllers/book.controller');

const router = express.Router();

router.post("/admin/add", isAuthenticated, "Authorized", addBook);
router.delete("/delete/:id", isAuthenticated, "Authorized", deleteBook);
router.get("/allBooks", isAuthenticated, getAllBooks);

module.exports = router;