const { Router } = require('express');
const db = require('./db');
const { authorize } = require('./middleware');
const ClientError = require('./client-error');

const decksRouter = new Router();

decksRouter.post('/', authorize, (req, res, next) => {
  const { userId } = req.user;
  const { name } = req.body;
  if (!name) {
    throw new ClientError(400, 'name is a required field');
  }
  const sql = `
    insert into "decks" ("userId", "name")
    values ($1, $2)
    returning *
  `;
  const params = [userId, name];
  db.query(sql, params)
    .then(result => {
      const [deck] = result.rows;
      res.status(201).json(deck);
    })
    .catch(err => next(err));
});

decksRouter.get('/:deckId', (req, res, next) => {
  const deckId = parseInt(req.params.deckId, 10);
  if (!Number.isInteger(deckId) || deckId < 1) {
    throw new ClientError(400, 'deckId must be a positive integer');
  }
  const sql = `
    select "d"."deckId",
           "d"."name",
           json_agg("f".*) as "flashcards"
      from "decks" as "d"
      join "deckFlashcards" using ("deckId")
      join "flashcards" as "f" using ("flashcardId")
     where "d"."deckId" = $1
  `;
  const params = [deckId];
  db.query(sql, params)
    .then(result => {
      const [deck] = result.rows;
      if (!deck) {
        throw new ClientError(404, `cannot find deck with deckId ${deckId}`);
      }
      res.json(deck);
    })
    .catch(err => next(err));
});

decksRouter.put('/:deckId', (req, res, next) => {
  const { userId } = req.user;
  const deckId = parseInt(req.params.deckId, 10);
  if (!Number.isInteger(deckId) || deckId < 1) {
    throw new ClientError(400, 'deckId must be a positive integer');
  }
  const { name } = req.body;
  if (!name) {
    throw new ClientError(400, 'name is a required field');
  }
  const sql = `
    update "decks"
       set "name" = $1
     where "deckId" = $2
       and "userId" = $3
    returning *
  `;
  const params = [name, deckId, userId];
  db.query(sql, params)
    .then(result => {
      const [deck] = result.rows;
      if (!deck) {
        throw new ClientError(`cannot find deck with deckId ${deckId}`);
      }
      res.json(deck);
    })
    .catch(err => next(err));
});

decksRouter.put('/:deckId/:flashcardId', authorize, (req, res, next) => {
  const { userId } = req.user;
  const deckId = parseInt(req.params.deckId, 10);
  if (!Number.isInteger(deckId) || deckId < 1) {
    throw new ClientError(400, 'deckId must be a positive integer');
  }
  const flashcardId = parseInt(req.params.flashcardId, 10);
  if (!Number.isInteger(flashcardId) || flashcardId < 1) {
    throw new ClientError(400, 'flashcardId must be a positive integer');
  }
  const sql = `
    insert into "deckFlashcards" ("deckId", "flashcardId")
    select $1,
           $2
     where exists (
       select 1
         from "decks"
        where "deckId" = $1
          and "userId" = $3
     ) and exists (
         select 1
           from "flashcards"
          where "flashcardId" = $2
     )
        on conflict ("deckId", "flashcardId")
        do update
              set "addedAt" = now()
           returning *
  `;
  const params = [deckId, flashcardId, userId];
  db.query(sql, params)
    .then(result => {
      const [deckFlashcard] = result.rows;
      if (!deckFlashcard) {
        throw new ClientError(404, `cannot find deck ${deckId} or flashcard ${flashcardId}`);
      }
      res.json(deckFlashcard);
    })
    .catch(err => next(err));
});

decksRouter.delete('/:deckId/:flashcardId', authorize, (req, res, next) => {
  const { userId } = req.user;
  const deckId = parseInt(req.params.deckId, 10);
  if (!Number.isInteger(deckId) || deckId < 1) {
    throw new ClientError(400, 'deckId must be a positive integer');
  }
  const flashcardId = parseInt(req.params.flashcardId, 10);
  if (!Number.isInteger(flashcardId) || flashcardId < 1) {
    throw new ClientError(400, 'flashcardId must be a positive integer');
  }
  const sql = `
    delete from "deckFlashcards"
     where "deckId"      = $1
       and "flashcardId" = $2
       and exists (
         select 1
           from "decks"
          where "deckId" = $1
            and "userId" = $3
       )
    returning *
  `;
  const params = [deckId, flashcardId, userId];
  db.query(sql, params)
    .then(result => {
      const [deckFlashcard] = result.rows;
      if (!deckFlashcard) {
        throw new ClientError(404, `cannot find deck ${deckId} or flashcard ${flashcardId}`);
      }
      res.sendStatus(204);
    })
    .catch(err => next(err));
});

module.exports = decksRouter;
