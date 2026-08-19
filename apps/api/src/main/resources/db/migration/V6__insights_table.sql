CREATE TABLE insights (
    id UUID PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,
    
    source_job_id UUID,

    source_aggregate_id UUID, 
    source_aggregate_type TEXT,

    insight_type TEXT NOT NULL,

    title TEXT NOT NULL,
    message TEXT NOT NULL,

    data JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX insights_source_job_type_unique
ON insights (
    source_job_id,
    insight_type
)
WHERE source_job_id IS NOT NULL;