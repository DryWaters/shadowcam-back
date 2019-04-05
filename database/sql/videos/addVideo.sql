INSERT INTO videos (work_id, file_size, video_length)
VALUES ($[work_id], $[file_size], $[video_length])
RETURNING video_id