CREATE TABLE job_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_type TEXT NOT NULL,

    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,

    payload JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    published_at TIMESTAMPTZ,

    attempt_count INTEGER NOT NULL DEFAULT 0,
    last_error TEXT
);