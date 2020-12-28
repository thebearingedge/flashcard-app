const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const db = require('./db');
const ClientError = require('./client-error');

const authRouter = new Router();

authRouter.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }
  argon2
    .hash(password)
    .then(hashedPassword => {
      const insert = `
        insert into "users" ("username", "hashedPassword")
        values ($1, $2)
        returning "userId", "username"
      `;
      const values = [username, hashedPassword];
      return db.query(insert, values);
    })
    .then(result => {
      const [user] = result.rows;
      const { userId } = user;
      const payload = { userId };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.status(201).json({ user, token });
    })
    .catch(err => next(err));
});

authRouter.post('/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
  }
  const select = `
    select "userId", "username", "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const values = [username];
  db.query(select, values)
    .then(result => {
      const [user] = result.rows;
      if (!user) throw new ClientError(401, 'invalid login');
      const { userId, username, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(matches => {
          if (!matches) throw new ClientError(401, 'invalid login');
          const payload = { userId };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          const user = { userId, username };
          res.status(201).json({ user, token });
        });
    })
    .catch(err => next(err));
});

module.exports = authRouter;
