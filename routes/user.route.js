const express = require('express');
const {isAuthenticated, isAuthorized} = require('../middlewares/auth.middleware');
const { getAllUsers, registerNewAdmin } = require('../controllers/user.controller');

const router = express.Router();

router.get("/allUsers", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

module.exports = router;