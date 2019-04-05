INSERT INTO workouts (email, recording_date, workout_length, num_of_intervals, interval_length)
    VALUES ($[email], $[recording_date], $[workout_length], $[num_of_intervals], $[interval_length])
        RETURNING work_id