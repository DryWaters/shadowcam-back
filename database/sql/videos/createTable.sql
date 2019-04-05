CREATE TABLE videos (
  video_id SERIAL PRIMARY KEY,
  work_id INTEGER REFERENCES workouts(work_id) NOT NULL,
  file_size INTEGER NOT NULL,
  video_length INTEGER NOT NULL
);