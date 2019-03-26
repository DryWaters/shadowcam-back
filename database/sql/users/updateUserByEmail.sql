UPDATE users
SET pswd_hash = $[pswd],
    first_name = $[fname],
    last_name = $[lname],
    gender = $[gender],
    birthdate = $[bdate],
    user_height = $[uheight],
    user_weight = $[uweight]
WHERE
    email = $[email];