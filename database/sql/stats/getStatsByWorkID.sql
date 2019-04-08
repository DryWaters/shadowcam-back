select stat_id, jab, power_rear, left_hook, right_hook, left_uppercut, right_uppercut, left_body_hook, right_body_hook
from stats
where work_id = $[work_id]