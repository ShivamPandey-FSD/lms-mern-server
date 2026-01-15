const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDb = require('./config/db');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRouter = require('./routes/auth.route');
const bookRouter = require('./routes/book.route');

const app = express();

app.use(
 cors({
  origin: [process.env.FRONTEND_PORT],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
 })
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/book', bookRouter);

connectDb();

app.use(errorMiddleware);

module.exports = app;
