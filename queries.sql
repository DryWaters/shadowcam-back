-- Create Tables
CREATE TABLE videos (
  video_id INTEGER PRIMARY KEY,
  work_id INTEGER REFERENCES workouts(work_id) NOT NULL,
  video_length INTEGER NOT NULL,
  file_size INTEGER NOT NULL,
  video_link VARCHAR (355) UNIQUE
);

CREATE TABLE workouts (
  work_id INTEGER PRIMARY KEY,
  email VARCHAR (50) REFERENCES users(email),
  recording_date TIMESTAMP NOT NULL,
  workout_length INTEGER NOT NULL,
  num_of_intervals INTEGER NOT NULL,
  interval_length INTEGER NOT NULL
);

CREATE TABLE users (
  email VARCHAR (50) PRIMARY KEY,
  pswd_hash VARCHAR (60) NOT NULL,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  gender CHAR NO NULL,
  birthdate DATE NOT NULL,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL
);

CREATE TABLE stats (
  stat_id INTEGER PRIMARY KEY,
  work_id INTEGER REFERENCES workouts(work_id),
  jab INTEGER NOT NULL,
  power_rear INTEGER NOT NULL,
  left_hook INTEGER NOT NULL,
  right_hook INTEGER NOT NULL,
  left_uppercut INTEGER NOT NULL,
  right_uppercut INTEGER NOT NULL,
  left_body_hook INTEGER NOT NULL,
  right_body_hook INTEGER NOT NULL,
);

-- Get user account based on email
SELECT 
    email, first_name, last_name, gender, birthdate, height, weight
FROM
    users
WHERE
    email = $1;

-- Get hashed password
SELECT
    pswd_hash
FROM
    users
WHERE
    email = $1;

-- Get all workouts on user
SELECT
    *
FROM
    workouts JOIN users ON (workouts.email = users.email);

-- Get workout based on WorkID
SELECT
    *
FROM
    workouts
WHERE
    work_id = $1;

-- Get statistics from specific workout
SELECT
    *
FROM
    stats JOIN workouts AS work ON(stats.work_id = work.work_id);

-- Add new user
INSERT INTO Users (email, pswd, fname, lname, gender, bdate, uheight, uweight);

-- 
 