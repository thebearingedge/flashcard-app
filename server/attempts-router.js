const { Router } = require('express');
const db = require('./db');
const ClientError = require('./client-error');

const attemptsRouter = new Router();

attemptsRouter.post('/', (req, res, next) => {
  const { userId } = req.user;
  const flashcardId = parseInt(req.body.flashcardId, 10);
  if (!Number.isInteger(flashcardId) || flashcardId < 1) {
    throw new ClientError(400, 'flashcardId must be a positive integer');
  }
  const isCorrect = Boolean(req.body.isCorrect);
  const sql = `
    insert into "attempts" ("userId", "flashcardId", "isCorrect")
    values ($1, $2, $3)
    returning *
  `;
  const params = [userId, flashcardId, isCorrect];
  db.query(sql, params)
    .then(result => {
      const [attempt] = result.rows;
      res.status(201).json(attempt);
    })
    .catch(err => next(err));
});

module.exports = attemptsRouter;
