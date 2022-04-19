const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');

const prisma = require('./services/connect-db');
const authRoutes = require('./routes/auth');
const { errorLogger, errorResponder } = require('./middlewares/error-handler');
const { isAuthenticated } = require('./middlewares/auth');

const app = express();

const isDev = process.env.NODE_ENV === 'development';

app.use(helmet());

if (isDev) {
  const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(',')
    : [];
  const corsOptions = {
    origin(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(express.json({ type: 'application/json' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

require('./services/localStrategy');
require('./services/googleStrategy');

app.use('/api/auth', authRoutes);
app.get('/api/users', isAuthenticated, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return next(error);
  }
});

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorLogger);
app.use(errorResponder);

module.exports = app;
