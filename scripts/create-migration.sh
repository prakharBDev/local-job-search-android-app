#!/bin/bash

# Script to create new database migration files with timestamps
# Usage: ./scripts/create-migration.sh "descriptive_name"

if [ $# -eq 0 ]; then
    echo "Usage: $0 \"descriptive_name\""
    echo "Example: $0 \"add_user_preferences\""
    exit 1
fi

# Get current timestamp in YYYYMMDD_HHMMSS format
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Convert descriptive name to lowercase and replace spaces with underscores
DESCRIPTIVE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

# Create filename
FILENAME="database/${TIMESTAMP}_${DESCRIPTIVE_NAME}.sql"

# Create the migration file
cat > "$FILENAME" << EOF
-- Migration: $1
-- Date: $(date +"%Y-%m-%d")
-- Author: [Your Name]
-- Purpose: [Brief description of what this migration does]

-- =====================================================
-- MIGRATION START
-- =====================================================

-- Add your SQL statements here
-- Example:
-- ALTER TABLE table_name ADD COLUMN new_column_name TEXT;

-- =====================================================
-- MIGRATION END
-- =====================================================

-- Rollback instructions (if needed):
-- Example:
-- ALTER TABLE table_name DROP COLUMN new_column_name;
EOF

echo "Created migration file: $FILENAME"
echo "Edit the file to add your SQL statements and update the metadata." 