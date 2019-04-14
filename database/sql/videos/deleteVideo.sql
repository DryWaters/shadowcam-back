DELETE FROM videos WHERE video_id IN
(SELECT MAX(video_id) FROM videos WHERE work_id = $[work_id])
RETURNING work_id