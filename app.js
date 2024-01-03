require('dotenv').config();
require('express-async-errors');

// extra-security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

// connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// routers
const authRouter = require('./routes/auth')
const booksRouter = require('./routes/books')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).	
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(express.static("public", {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/books', authenticateUser, booksRouter)


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
