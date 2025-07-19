![Notionography Logo](logo.png)

A web-based mapping application that pulls location data from Notion databases and displays them on interactive maps using Mapbox.

## Features

- **Notion Integration**: Connect to any Notion database with location data
- **Interactive Maps**: Beautiful, responsive maps powered by Mapbox
- **Embed Support**: Embed maps directly in Notion pages
- **Real-time Data**: Always up-to-date with your Notion database
- **Category Colors**: Color-coded markers based on Notion select fields
- **Minimal Design**: Clean, focused interface

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Notionography
yarn install
```

### 2. Set Up Environment Variables

Run the setup script to configure your API tokens:

```bash
./setup-env.sh
```

Or manually create a `.env` file:

```env
NOTION_TOKEN=your_notion_integration_token_here
MAPBOX_TOKEN=your_mapbox_access_token_here
```

### 3. Get Your API Tokens

#### Notion Integration Token

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Notionography")
4. Copy the "Internal Integration Token"

#### Mapbox Access Token

1. Go to [Mapbox Access Tokens](https://account.mapbox.com/access-tokens/)
2. Create a new token or use your default public token
3. Copy the token

### 4. Set Up Your Notion Database

Create a Notion database with these properties:

| Property    | Type      | Required         | Description                                    |
| ----------- | --------- | ---------------- | ---------------------------------------------- |
| `Latitude`  | Number    | ✅ if no Address | Latitude coordinate                            |
| `Longitude` | Number    | ✅ if no Address | Longitude coordinate                           |
| `Address`   | Text      | ✅ if no Lat/Lng | Human-readable address (geocoding coming soon) |
| `Notes`     | Rich Text | ❌               | Additional information                         |
| `Category`  | Select    | ❌               | Category with color-coded markers              |

### 5. Share Your Database

1. Open your Notion database
2. Click "Share" in the top right
3. Click "Invite" and search for your integration name
4. Select your integration and click "Invite"

### 6. Get Your Database ID

The database ID is in the URL when you view your database:

```
https://www.notion.so/workspace/DATABASE_ID?v=...
```

### 7. Run the Development Server

```bash
yarn dev
```

Visit `http://localhost:5173` and enter your database ID to see your map!

## Usage

### Viewing Maps

1. **Home Page**: Enter your database ID and click "View Map"
2. **Direct URL**: Navigate to `/map?db=YOUR_DATABASE_ID`
3. **Embed in Notion**: Use `/embed?db=YOUR_DATABASE_ID`

### Embedding in Notion

1. In your Notion page, type `/embed`
2. Paste the embed URL: `https://your-domain.com/embed?db=YOUR_DATABASE_ID`
3. The map will appear inline in your Notion page

## Categories & Colors

### Setting Up Categories

1. **Add a Select field** to your Notion database
2. **Name it "Category"** (case-insensitive)
3. **Create your categories** with different colors
4. **Assign categories** to your locations

### Color-Coded Markers

Each category will display with its Notion color on the map.

For example:

- **Food locations** → Brown markers
- **Playground locations** → Green markers
- **Art locations** → Blue markers
- **Uncategorized locations** → Default blue markers

### Supported Colors

The app supports all Notion select field colors:

- Default, Gray, Brown, Orange, Yellow
- Green, Blue, Purple, Pink, Red

Categories are optional - locations without categories will use the default blue marker.

## API Reference

### GET `/api/locations?db=DATABASE_ID`

Returns location data from your Notion database.

**Response:**

```json
{
	"locations": [
		{
			"name": "Location Name",
			"lat": 40.7128,
			"lng": -74.006,
			"notes": "Optional notes",
			"category": "Food",
			"categoryColor": "brown"
		}
	],
	"count": 1
}
```

**Error Response:**

```json
{
	"error": "Error message",
	"details": ["Additional error details"]
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NOTION_TOKEN`
   - `MAPBOX_TOKEN`
4. Deploy!

### Other Platforms

The app uses SvelteKit's auto-adapter, so it should work on most platforms that support Node.js.

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn check` - Type check
- `yarn lint` - Lint code

### Project Structure

```
src/
├── app.css              # Global styles
├── app.html             # HTML template
├── routes/
│   ├── +layout.svelte   # Root layout
│   ├── +page.svelte     # Home page
│   ├── map/
│   │   └── +page.svelte # Map page
│   ├── embed/
│   │   └── +page.svelte # Embed page
│   └── api/
│       └── locations/
│           └── +server.ts # API endpoint
```

## Troubleshooting

### Common Issues

**"Notion integration not authorized"**

- Make sure you've shared your database with the integration
- Check that your `NOTION_TOKEN` is correct

**"Database not found"**

- Verify your database ID is correct
- Ensure the integration has access to the database

**"No locations found"**

- Check that your database has `Latitude` and `Longitude` properties
- Verify the property names match exactly (case-sensitive)

**"Mapbox token not configured"**

- Set your `MAPBOX_TOKEN` environment variable
- Check that the token is valid and has the correct permissions

### Getting Help

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test your Notion integration token with the Notion API directly
4. Ensure your Mapbox token has the necessary permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
