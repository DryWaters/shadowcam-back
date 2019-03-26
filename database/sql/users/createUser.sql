INSERT INTO users (email, pswd_hash, first_name, last_name, birthdate, gender, height, weight)
    VALUES ($[email], $[password], $[firstName], $[lastName], $[birthdate], $[gender], $[height], $[weight]) 
      RETURNING email