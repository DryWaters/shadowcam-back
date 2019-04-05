SELECT work_id
FROM workouts
WHERE email = $[email]
ORDER BY work_id DESC