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
  right_body_hook INTEGER NOT NULL
);