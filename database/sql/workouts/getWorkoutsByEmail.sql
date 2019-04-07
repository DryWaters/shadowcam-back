SELECT work_id, recording_date, workout_length, num_of_intervals, interval_length
FROM workouts
WHERE email = $[email]
ORDER BY work_id DESC