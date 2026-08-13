CREATE TABLE processed_client_mutations (
    mutation_id UUID PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    device_id TEXT NOT NULL,

    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,
    operation TEXT NOT NULL,

    local_revision BIGINT NOT NULL,
    base_server_version BIGINT,

    status TEXT NOT NULL,
    resulting_server_version BIGINT,

    problem_code TEXT,
    problem_message TEXT,

    processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT processed_mutation_aggregate_type_check
        CHECK (
            aggregate_type IN (
                'workout',
                'workout_plan'
            )
        ),

    CONSTRAINT processed_mutation_operation_check
        CHECK (
            operation IN (
                'upsert',
                'delete'
            )
        ),

    CONSTRAINT processed_mutation_status_check
        CHECK (
            status IN (
                'processing',
                'applied',
                'conflict',
                'rejected'
            )
        )
);

CREATE INDEX processed_mutations_user_idx
ON processed_client_mutations (
    user_id,
    processed_at
);

CREATE TABLE sync_changes (
    sequence BIGSERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    aggregate_type TEXT NOT NULL,
    aggregate_id UUID NOT NULL,

    operation TEXT NOT NULL,

    server_version BIGINT NOT NULL,

    mutation_id UUID,

    origin_device_id TEXT,

    payload JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

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

CREATE INDEX sync_changes_user_sequence_idx
ON sync_changes (
    user_id,
    sequence
);