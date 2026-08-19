ALTER TABLE sync_changes
DROP CONSTRAINT sync_changes_aggregate_type_check;

ALTER TABLE sync_changes
ADD CONSTRAINT sync_changes_aggregate_type_check
    CHECK (
        aggregate_type IN (
            'workout',
            'workout_plan', 
            'insight'
        )
    );