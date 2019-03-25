CREATE TABLE users (
  email VARCHAR (50) PRIMARY KEY,
  pswd_hash VARCHAR (60) NOT NULL,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  gender CHAR NOT NULL,
  birthdate DATE NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL
);