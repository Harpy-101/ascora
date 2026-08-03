// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_slimy_warpath.sql';
import m0001 from './0001_add_users__workouts_workout_sets_and_workout_exercise_tables.sql';
import m0002 from './0002_rename_users_table.sql';
import m0003 from './0003_workout_plans_tables.sql';
import m0004 from './0004_add_set_count_column_to_workout_template_sets_table.sql';
import m0005 from './0005_add_exercise_name_column_to_workout_exercise_table.sql';
import m0006 from './0006_remove-non_null_restriction_to_support_saving_non_completed_workout_sets.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006
    }
  }
  