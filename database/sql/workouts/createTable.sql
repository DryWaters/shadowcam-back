CREATE TABLE workouts (
  work_id SERIAL PRIMARY KEY,
  email VARCHAR (50) REFERENCES users(email),
  recording_date DATE NOT NULL,
  workout_length INTEGER NOT NULL,
  num_of_intervals INTEGER NOT NULL,
  interval_length INTEGER NOT NULL
);