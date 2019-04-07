SELECT video_id, jab, power_rear, left_hook, right_hook, left_uppercut, right_uppercut, left_body_hook, right_body_hook
FROM videos JOIN stats ON videos.work_id = stats.work_id
WHERE videos.work_id = $[work_id]