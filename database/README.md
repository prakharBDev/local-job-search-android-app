# Database Migrations

This directory contains database migration files for the JobApp project.

## Migration File Naming Convention

Migrations should be named using the following format:
```
YYYYMMDD_HHMMSS_descriptive_name.sql
```

### Examples:
- `20241220_143000_add_onboarding_tracking.sql`
- `20241221_091500_add_user_preferences.sql`
- `20241222_160000_fix_rls_policies.sql`

## Migration Structure

Each migration file should include:

1. **Header with metadata**:
   ```sql
   -- Migration: [Description]
   -- Date: [YYYY-MM-DD]
   -- Author: [Your Name]
   -- Purpose: [Brief description]
   ```

2. **Migration body** with SQL statements

3. **Rollback instructions** (if needed)

## Best Practices

1. **Idempotent migrations**: Write migrations that can be run multiple times safely
2. **Test locally**: Always test migrations on a local database first
3. **Backup before applying**: Create a backup before applying migrations to production
4. **Use transactions**: Wrap migrations in transactions when possible
5. **Document changes**: Include clear comments explaining what the migration does

## Applying Migrations

### Local Development
```bash
# Connect to your local Supabase instance
psql -h localhost -U postgres -d postgres -f database/20241220_143000_add_onboarding_tracking.sql
```

### Production (Supabase)
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration content
4. Execute the migration

## Migration Template

Use `migration_template.sql` as a starting point for new migrations.

## Current Migrations

1. **20241220_140000_cleanup_rls_policies.sql**
   - Cleans up temporary RLS policies used for debugging

2. **20241220_141000_fix_rls_policies.sql**
   - Fixes RLS policies by casting UUID to text for proper comparison

3. **20241220_142000_add_phone_number.sql**
   - Adds phone_number column to users table

4. **20241220_142500_remove_is_poster.sql**
   - Removes is_poster column from users table

5. **20241220_143000_add_onboarding_tracking.sql**
   - Adds onboarding tracking columns to users table
   - Prevents showing onboarding flow repeatedly
   - Updates existing users based on their profile status

## Rollback Strategy

If you need to rollback a migration, create a new migration file with the reverse operations. For example:

- If migration adds a column, create a rollback migration that drops the column
- If migration creates a table, create a rollback migration that drops the table

## Version Control

- Always commit migration files to version control
- Never modify existing migration files that have been applied to production
- Create new migrations for any changes to existing migrations 