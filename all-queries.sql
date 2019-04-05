-- [x] Create videos table 
CREATE TABLE videos (
  video_id SERIAL PRIMARY KEY,
  work_id INTEGER REFERENCES workouts(work_id) NOT NULL,
  file_size INTEGER NOT NULL,
  video_length_in_sec INTEGER NOT NULL,
);

-- [x] Create workouts table
CREATE TABLE workouts (
  work_id SERIAL PRIMARY KEY,
  email VARCHAR (50) REFERENCES users(email),
  recording_date DATE NOT NULL,
  workout_length INTEGER NOT NULL,
  num_of_intervals INTEGER NOT NULL,
  interval_length INTEGER NOT NULL
);

-- [x] create users table
CREATE TABLE users (
  email VARCHAR (50) PRIMARY KEY,
  pswd_hash VARCHAR (60) NOT NULL,
  first_name VARCHAR (50) NOT NULL,
  last_name VARCHAR (50) NOT NULL,
  gender CHAR NO NULL,
  birthdate DATE NOT NULL,
  user_height INTEGER NOT NULL,
  user_weight INTEGER NOT NULL
);

-- [x] create stats table
CREATE TABLE stats (
  stat_id SERIAL PRIMARY KEY,
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

-- [x] Get user account based on email
SELECT 
    email, first_name, last_name, gender, birthdate, user_height, user_weight
FROM
    users
WHERE
    email = $[email];

-- [] Get hashed password
SELECT
    pswd_hash
FROM
    users
WHERE
    email = $[email];

-- [] Get all workouts on user
SELECT
    *
FROM
    workouts JOIN users ON (workouts.email = users.email);

-- [] Get single workout based on WorkID
SELECT
    *
FROM
    workouts
WHERE
    work_id = $[w_id];

-- Get statistics from specific workout
SELECT
    *
FROM
    stats JOIN workouts AS work ON(stats.work_id = work.work_id);

-- [x] Add new user
INSERT INTO users ($[email], $[pswd], $[fname], $[lname], $[gender], $[bdate], 
$[uheight], $[uweight]);

-- [] Add workout
INSERT INTO workouts(email, recording_date, workout_length, num_of_intervals, interval_length)
VALUES($[email], $[rec_date], $[work_len], $[num_of_int], $[int_len]);

-- [] Add video
INSERT INTO videos (work_id, file_size, video_length)
VALUES ($[work_id], $[file_size], $[video_length])

-- [] Get latest video_id by email
SELECT video_id
FROM videos
WHERE email = $[email]
ORDER BY video_id DESC

-- [] Add stats
INSERT INTO stats ($[statid], $[workid], $[jab], $[pwr_r], $[lhook], $[rhook], 
$[lupper], $[rupper], $[lbhook], $[rbhook]);

-- [x] Update user, not email
UPDATE users
SET pswd_hash = $[pswd],
    first_name = $[fname],
    last_name = $[lname],
    gender = $[gender],
    birthdate = $[bdate],
    user_height = $[uheight],
    user_weight = $[uweight]
WHERE
    email = $[email];

-- [] Get videos based off workID
SELECT video_id
FROM videos
WHERE work_id = $[work_id]

-- [] Get stats based off workiD
SELECT stat_id
FROM stats
WHERE work_id = $[work_id]

-- [] Get latest workout id by username
SELECT work_id
FROM workouts
WHERE email = $[email]
ORDER BY work_id DESC