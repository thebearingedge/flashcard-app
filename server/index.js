require('dotenv/config');
const path = require('path');
const express = require('express');
const authRouter = require('./auth-router');
const decksRouter = require('./decks-router');
const flashcardsRouter = require('./flashcards-router');
const { authorize, apiNotFound, errorHandler } = require('./middleware');

const app = express();

const publicPath = path.join(__dirname, 'public');
const staticMiddleware = express.static(publicPath);

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.use('/api/auth', authRouter);
app.use(authorize);
app.use('/api/decks', decksRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api', apiNotFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
