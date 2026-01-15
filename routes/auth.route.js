const express = require('express');
const { register, verifyOtp, login, logout, getUsers, forgotPassword, resetPassword, updatePassword } = require('../controllers/auth.controller');
const isAuthenticated = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getUsers);
router.post('/password/forgot', forgotPassword);
router.patch('/password/reset/:token', resetPassword);
router.patch('/password/update', isAuthenticated, updatePassword);

module.exports = router;
