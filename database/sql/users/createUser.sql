INSERT INTO public.users(email, password)
    VALUES ($1, $2) RETURNING email