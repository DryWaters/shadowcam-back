INSERT INTO videos (work_id, file_size, screenshot)
VALUES ($[work_id], $[file_size], $[screenshot])
RETURNING video_id