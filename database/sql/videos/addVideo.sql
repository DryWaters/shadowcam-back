INSERT INTO videos (work_id, file_size)
VALUES ($[work_id], $[file_size])
RETURNING video_id