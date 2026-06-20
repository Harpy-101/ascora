// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_slimy_warpath.sql';
import m0001 from './0001_add_users__workouts_workout_sets_and_workout_exercise_tables.sql';
import m0002 from './0002_rename_users_table.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002
    }
  }
  