DROP TABLE sync_changes;

CREATE TABLE sync_changes (
    id BIGSERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    user_sequence BIGINT NOT NULL,

    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,

    operation TEXT NOT NULL,

    server_version BIGINT NOT NULL,

    mutation_id UUID,

    origin_device_id TEXT,

    payload JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT sync_changes_user_sequence_unique
        UNIQUE (user_id, user_sequence),

    CONSTRAINT sync_changes_aggregate_type_check
        CHECK (
            aggregate_type IN (
                'workout',
                'workout_plan'
            )
        ),

    CONSTRAINT sync_changes_operation_check
        CHECK (
            operation IN (
                'upsert',
                'delete'
            )
        ),
    
    CONSTRAINT sync_changes_payload_check
        CHECK (
            (
                operation = 'upsert'
                AND payload IS NOT NULL
            )
            OR
            (
                operation = 'delete'
                AND payload IS NULL
            )
        )
);

CREATE TABLE user_sync_stream (
    user_id UUID PRIMARY KEY
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    current_sequence BIGINT NOT NULL DEFAULT 0,

    pruned_through BIGINT NOT NULL DEFAULT 0
);