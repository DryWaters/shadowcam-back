INSERT INTO workouts (email, recording_date, workout_length, num_of_intervals, interval_length)
    VALUES ($[email], CURRENT_TIMESTAMP, $[work_len], $[num_of_int], $[int_len])
        RETURNING work_id