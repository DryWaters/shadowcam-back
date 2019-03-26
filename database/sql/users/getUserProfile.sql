SELECT email, first_name, last_name, gender, birthdate, height, weight
  FROM users
    WHERE email = $[email];