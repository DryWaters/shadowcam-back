SELECT email, pswd_hash
    FROM users
        WHERE email = $[email]