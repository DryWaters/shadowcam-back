-- Create Tables
CREATE TABLE Videos (
  VideoID INTEGER PRIMARY KEY,
  WorkID INTEGER REFERENCES Workouts(WorkID) NOT NULL,
  VideoLength INTEGER NOT NULL,
  FileSize INTEGER NOT NULL,
  VideoLink VARCHAR (355) UNIQUE
);

CREATE TABLE Workouts (
  WorkID INTEGER PRIMARY KEY,
  Email VARCHAR (50) REFERENCES Users(Email),
  RecordingDate TIMESTAMP NOT NULL,
  WorkoutLength INTEGER NOT NULL,
  NumOfIntervals INTEGER NOT NULL,
  IntervalLength INTEGER NOT NULL
);

CREATE TABLE Users (
  Email VARCHAR (50) PRIMARY KEY,
  PswdHash VARCHAR (60) NOT NULL,
  FirstName VARCHAR (50) NOT NULL,
  LastName VARCHAR (50) NOT NULL,
  Gender CHAR NO NULL,
  Birthdate DATE NOT NULL,
  UserHeight INTEGER NOT NULL,
  UserWeight INTEGER NOT NULL
);

CREATE TABLE Stats (
  StatID INTEGER PRIMARY KEY,
  WorkID INTEGER REFERENCES Workouts(WorkID),
  Jab INTEGER NOT NULL,
  PowerRear INTEGER NOT NULL,
  LeftHook INTEGER NOT NULL,
  RightHook INTEGER NOT NULL,
  LeftUppercut INTEGER NOT NULL,
  RightUppercut INTEGER NOT NULL,
  LeftBodyHook INTEGER NOT NULL,
  RightBodyHook INTEGER NOT NULL,
);

-- Get user account based on email
SELECT 
    Email, FirstName, LastName, Gender, Birthdate, Height, Weight
FROM
    Users
WHERE
    Email = $1;

-- Get hashed password
SELECT
    PswdHash
FROM
    Users
WHERE
    Email = $1;

-- Get all workouts on user
SELECT
    *
FROM
    Workouts JOIN Users ON (Workouts.Email = Users.Email);

-- Get workout based on WorkID
SELECT
    *
FROM
    Workouts
WHERE
    WorkID = $1;

-- Get statistics from specific workout
SELECT
    *
FROM
    Stats JOIN Workouts AS work ON(Stats.WorkID = work.WorkID);

-- Add new user
INSERT INTO Users (email, pswd, fname, lname, gender, bdate, uheight, uweight);

-- 
 