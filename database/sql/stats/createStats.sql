INSERT INTO stats 
(work_id, jab, power_rear, left_hook, right_hook, left_uppercut, 
right_uppercut, left_body_hook, right_body_hook)
    VALUES ($[work_id], $[jab], $[power_rear], $[left_hook], 
    $[right_hook], $[left_uppercut], $[right_uppercut], $[left_body_hook], $[right_body_hook])
        RETURNING stat_id