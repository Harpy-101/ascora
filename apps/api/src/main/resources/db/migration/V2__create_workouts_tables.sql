CREATE TABLE workouts (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    name TEXT NOT NULL,

    status TEXT NOT NULL,

    source_template_id TEXT,

    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    server_version BIGINT NOT NULL DEFAULT 1
);

CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY,

    workout_id UUID NOT NULL
        REFERENCES workouts(id)
        ON DELETE CASCADE,

    exercise_id TEXT NOT NULL,

    exercise_name TEXT NOT NULL,

    position INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workout_sets (
    id UUID PRIMARY KEY,

    workout_exercise_id UUID NOT NULL
        REFERENCES workout_exercises(id)
        ON DELETE CASCADE,

    set_number INTEGER NOT NULL,

    weight_in_kg NUMERIC,
    reps INTEGER,

    completed BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);