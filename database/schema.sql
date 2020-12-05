set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- drop schema INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "users" (
  "userId"         serial,
  "username"       text not null,
  "hashedPassword" text not null,
  primary key ("userId"),
  unique ("username")
);

create table "flashcards" (
  "flashcardId" serial,
  "userId"      integer not null,
  "question"    text    not null,
  "answer"      text    not null,
  "tags"        jsonb   not null default '[]',
  primary key ("flashcardId"),
  foreign key ("userId")
   references "users" ("userId")
);

create table "decks" (
  "deckId" serial,
  "userId" integer not null,
  "name"   text    not null,
  primary key ("deckId"),
  foreign key ("userId")
   references "users" ("userId")
);

create table "deckFlashcards" (
  "deckId"      integer not null,
  "flashcardId" integer not null,
  unique ("deckId", "flashcardId"),
  foreign key ("deckId")
   references "decks" ("deckId"),
  foreign key ("flashcardId")
   references "flashcards" ("flashcardId")
);

create table "attempts" (
  "attemptId"   serial,
  "userId"      integer        not null,
  "flashcardId" integer        not null,
  "isCorrect"   boolean        not null,
  "attemptedAt" timestamptz(6) not null default now(),
  primary key ("attemptId"),
  foreign key ("userId")
   references "users" ("userId"),
  foreign key ("flashcardId")
   references "flashcards" ("flashcardId")
);
