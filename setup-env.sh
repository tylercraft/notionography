#!/bin/bash

echo "🚀 Setting up Notionography environment variables..."
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. This will overwrite it."
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

echo ""
echo "📝 Please provide your API tokens:"
echo ""

# Get Notion token
read -p "Enter your Notion integration token (you can name your integration 'Notionography'): " NOTION_TOKEN
if [ -z "$NOTION_TOKEN" ]; then
    echo "❌ Notion token is required!"
    exit 1
fi

# Get Mapbox token
read -p "Enter your Mapbox access token: " MAPBOX_TOKEN
if [ -z "$MAPBOX_TOKEN" ]; then
    echo "❌ Mapbox token is required!"
    exit 1
fi

# Create .env file
cat > .env << EOF
# Notion API Configuration
NOTION_TOKEN=$NOTION_TOKEN

# Mapbox Configuration
PUBLIC_MAPBOX_TOKEN=$MAPBOX_TOKEN
EOF

echo ""
echo "✅ Environment variables saved to .env"
echo ""
echo "🔗 Get your tokens from:"
echo "   Notion: https://www.notion.so/my-integrations"
echo "   Mapbox: https://account.mapbox.com/access-tokens/"
echo ""
echo "🚀 You can now run 'yarn dev' to start the development server!" 