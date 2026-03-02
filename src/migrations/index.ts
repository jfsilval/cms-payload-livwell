import * as migration_20260213_172621_initial from './20260213_172621_initial'
import * as migration_20260302_181531 from './20260302_181531'

export const migrations = [
  {
    up: migration_20260213_172621_initial.up,
    down: migration_20260213_172621_initial.down,
    name: '20260213_172621_initial',
  },
  {
    up: migration_20260302_181531.up,
    down: migration_20260302_181531.down,
    name: '20260302_181531',
  },
]

