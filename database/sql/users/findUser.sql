SELECT email, password
    FROM public.users
        WHERE email = $1