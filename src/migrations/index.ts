import * as migration_20260213_172621_initial from './20260213_172621_initial'
import * as migration_20260302_181531 from './20260302_181531'
import * as migration_20260310_000001_add_localization from './20260310_000001_add_localization'
import * as migration_20260310_000002_add_posts_meta_locales from './20260310_000002_add_posts_meta_locales'
import * as migration_20260310_000003_add_categories_locale from './20260310_000003_add_categories_locale'
import * as migration_20260310_000004_add_pages_locales from './20260310_000004_add_pages_locales'
import * as migration_20260310_000005_add_versions_columns from './20260310_000005_add_versions_columns'


export const migrations = [
  { up: migration_20260213_172621_initial.up, down: migration_20260213_172621_initial.down, name: '20260213_172621_initial' },
  { up: migration_20260302_181531.up, down: migration_20260302_181531.down, name: '20260302_181531' },
  { up: migration_20260310_000001_add_localization.up, down: migration_20260310_000001_add_localization.down, name: '20260310_000001_add_localization' },
  { up: migration_20260310_000002_add_posts_meta_locales.up, down: migration_20260310_000002_add_posts_meta_locales.down, name: '20260310_000002_add_posts_meta_locales' },
  { up: migration_20260310_000003_add_categories_locale.up, down: migration_20260310_000003_add_categories_locale.down, name: '20260310_000003_add_categories_locale' },
  { up: migration_20260310_000004_add_pages_locales.up, down: migration_20260310_000004_add_pages_locales.down, name: '20260310_000004_add_pages_locales' },
  { up: migration_20260310_000005_add_versions_columns.up, down: migration_20260310_000005_add_versions_columns.down, name: '20260310_000005_add_versions_columns' },
]


