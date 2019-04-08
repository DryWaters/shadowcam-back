select work_id, recording_date, workout_length, num_of_intervals, interval_length
from workouts
where work_id = $[work_id]