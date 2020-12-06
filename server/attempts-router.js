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
    select $1,
           $2,
           $3
     where exists (
       select 1
         from "flashcards"
        where "userId"      = $1
          and "flashcardId" = $2
     )
    returning *
  `;
  const params = [userId, flashcardId, isCorrect];
  db.query(sql, params)
    .then(result => {
      const [attempt] = result.rows;
      if (!attempt) {
        throw new ClientError(404, `cannot find flashcard with flashcardId ${flashcardId}`);
      }
      res.status(201).json(attempt);
    })
    .catch(err => next(err));
});

module.exports = attemptsRouter;
