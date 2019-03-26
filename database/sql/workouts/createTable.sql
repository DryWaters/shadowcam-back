CREATE TABLE workouts (
  work_id INTEGER PRIMARY KEY,
  email VARCHAR (50) REFERENCES users(email),
  recording_date TIMESTAMP NOT NULL,
  workout_length INTEGER NOT NULL,
  num_of_intervals INTEGER NOT NULL,
  interval_length INTEGER NOT NULL
);