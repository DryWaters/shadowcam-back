INSERT INTO users(email, password, first_name, last_name, birth_date, gender, height, weight)
    VALUES (${email} ${password} ${first_name} ${last_name} ${birth_date} ${gender} {$height} ${weight}) 
      RETURNING email