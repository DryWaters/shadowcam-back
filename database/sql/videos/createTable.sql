CREATE TABLE videos (
  video_id INTEGER PRIMARY KEY,
  work_id INTEGER REFERENCES workouts(work_id) NOT NULL,
  video_length INTEGER NOT NULL,
  file_size INTEGER NOT NULL,
  video_link VARCHAR (355) UNIQUE
);