#!/bin/bash

# Script to copy ALL components from /tmp/sandbox/tmp/sandbox/src/app/components/ 
# to /src/app/components/

SOURCE_DIR="/tmp/sandbox/tmp/sandbox/src/app/components"
DEST_DIR="/src/app/components"

echo "🚀 Copying ALL components from tmp to src..."
echo "Source: $SOURCE_DIR"
echo "Dest: $DEST_DIR"
echo ""

# Count files
TOTAL=$(find "$SOURCE_DIR" -maxdepth 1 -name "*.tsx" -type f | wc -l)
echo "📊 Found $TOTAL components to copy"
echo ""

# Copy all .tsx files (excluding subdirectories)
COPIED=0
for file in "$SOURCE_DIR"/*.tsx; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        
        # Skip if already exists and is the same
        if [ -f "$DEST_DIR/$filename" ]; then
            echo "⏭️  Skipping $filename (already exists)"
        else
            cp "$file" "$DEST_DIR/"
            COPIED=$((COPIED + 1))
            echo "✅ Copied $filename"
        fi
    fi
done

echo ""
echo "✨ Done! Copied $COPIED new components"
echo "📁 Total components in $DEST_DIR:"
find "$DEST_DIR" -maxdepth 1 -name "*.tsx" ! -path "*/ui/*" ! -path "*/figma/*" -type f | wc -l
