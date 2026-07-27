CREATE TABLE app_users(
    id UUID PRIMARY KEY, 
    auth_subject TEXT  NOT NULL, 
    full_name TEXT NOT NULL, 
    display_name TEXT NOT NULL, 
    email TEXT NOT NULL, 
    avatar_url TEXT, 
    created_at TIMESTAMPTZ NOT NULL, 
    updated_at TIMESTAMPTZ NOT NULL, 
    version BIGINT NOT NULL DEFAULT 0, 

    CONSTRAINT app_users_auth_subject_unique UNIQUE(auth_subject)
);

CREATE INDEX app_users_email_idx ON app_users(email);