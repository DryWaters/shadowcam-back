SELECT email, pswd_hashy
    FROM users
        WHERE email = $1