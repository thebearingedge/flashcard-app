const { Router } = require('express');
const db = require('./db');
const ClientError = require('./client-error');

const flashcardsRouter = new Router();

flashcardsRouter.post('/', (req, res, next) => {
  const { userId } = req.user;
  const { question, answer, tags = [] } = req.body;
  if (!question || !answer) {
    throw new ClientError(400, 'question and answer are required fields');
  }
  if (!Array.isArray(tags)) {
    throw new ClientError(400, 'tags must be an array');
  }
  const sql = `
    insert into "flashcards" ("userId", "question", "answer", "tags")
    values ($1, $2, $3, $4)
    returning *
  `;
  const params = [userId, question, answer, JSON.stringify(tags)];
  db.query(sql, params)
    .then(result => {
      const [flashcard] = result.rows;
      res.status(201).json(flashcard);
    })
    .catch(err => next(err));
});

flashcardsRouter.get('/', (req, res, next) => {
  const { userId } = req.user;
  const { tags = [] } = req.query;
  if (!Array.isArray(tags)) {
    throw new ClientError(400, 'tags must be an array');
  }
  const sql = `
    select *
      from "flashcards"
     where "userId" = $1
       and case when array_length($2::text[], 1) = 0
                then true
                else "tags" ?& $2::text[]
           end
  `;
  const params = [userId, tags];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

flashcardsRouter.get('/:flashcardId', (req, res, next) => {
  const { userId } = req.user;
  const flashcardId = parseInt(req.params.flashcardId, 10);
  if (!Number.isInteger(flashcardId) || flashcardId < 1) {
    throw new ClientError(400, 'flashcardId must be a positive integer');
  }
  const sql = `
    select *
      from "flashcards"
     where "flashcardId" = $1
       and "userId"      = $2
  `;
  const params = [flashcardId, userId];
  db.query(sql, params)
    .then(result => {
      const [flashcard] = result.rows;
      if (!flashcard) {
        throw new ClientError(404, `cannot find flashcard with flashcardId ${flashcardId}`);
      }
      res.json(flashcard);
    })
    .catch(err => next(err));
});

flashcardsRouter.put('/:flashcardId', (req, res, next) => {
  const { userId } = req.user;
  const flashcardId = parseInt(req.params.flashcardId, 10);
  if (!Number.isInteger(flashcardId) || flashcardId < 1) {
    throw new ClientError(400, 'flashcardId must be a positive integer');
  }
  const { question, answer, tags = [] } = req.body;
  if (!question || !answer) {
    throw new ClientError(400, 'question and answer are required fields');
  }
  if (!Array.isArray(tags)) {
    throw new ClientError(400, 'tags must be an array');
  }
  const sql = `
    update "flashcards"
       set "question" = $1,
           "answer"   = $2,
           "tags"     = $3
     where "flashcardId" = $4
       and "userId"      = $5
    returning *
  `;
  const params = [question, answer, JSON.stringify(tags), flashcardId, userId];
  db.query(sql, params)
    .then(result => {
      const [flashcard] = result.rows;
      if (!flashcard) {
        throw new ClientError(404, `cannot find flashcard with flashcardId ${flashcardId}`);
      }
      res.json(flashcard);
    })
    .catch(err => next(err));
});

flashcardsRouter.delete('/:flashcardId', (req, res, next) => {
  const { userId } = req.user;
  const flashcardId = parseInt(req.params.flashcardId, 10);
  if (!Number.isInteger(flashcardId) || flashcardId < 1) {
    throw new ClientError(400, 'flashcardId must be a positive integer');
  }
  const sql = `
    with "deletedDeckFlashcards" as (
      delete from "deckFlashcards" as "df" using "flashcards" as "f"
        where "df"."flashcardId" = $1
          and "f"."flashcardId"  = $1
          and "f"."userId"       = $2
    )
    delete from "flashcards"
     where "flashcardId" = $1
       and "userId"      = $2
    returning *
  `;
  const values = [flashcardId, userId];
  db.query(sql, values)
    .then(result => {
      const [flashcard] = result.rows;
      if (!flashcard) {
        throw new ClientError(404, `cannot find flashcard with flashcardId ${flashcardId}`);
      }
      res.sendStatus(204);
    });
});

flashcardsRouter.post('/:flashcardId/attempts', (req, res, next) => {
  const { userId } = req.user;
  const flashcardId = parseInt(req.params.flashcardId, 10);
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

module.exports = flashcardsRouter;
