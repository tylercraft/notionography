import { json } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import { NOTION_TOKEN } from '$env/static/private';
import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
import type { RequestHandler } from './$types';

interface LocationData {
	name: string;
	lat: number;
	lng: number;
	notes?: string;
	url?: string;
	category?: string;
	categoryColor?: string;
}

interface NotionPage {
	id: string;
	properties: {
		[name: string]: {
			type: string;
			number?: number;
			rich_text?: Array<{
				plain_text: string;
			}>;
			title?: Array<{
				plain_text: string;
			}>;
			select?: {
				name: string;
				color: string;
			};
			url?: string;
		};
	};
}

export const GET: RequestHandler = async ({ url }) => {
	const databaseId = url.searchParams.get('db');

	if (!databaseId) {
		return json(
			{ error: 'Missing database ID. Please provide a ?db= parameter.' },
			{ status: 400 }
		);
	}

	if (!NOTION_TOKEN) {
		return json(
			{ error: 'Notion token not configured. Please set NOTION_TOKEN in your environment.' },
			{ status: 500 }
		);
	}

	try {
		const notion = new Client({
			auth: NOTION_TOKEN
		});

		// Query the database
		const response = await notion.databases.query({
			database_id: databaseId
		});

		const locations: LocationData[] = [];
		const errors: string[] = [];

		for (const page of response.results as NotionPage[]) {
			const properties = page.properties;

			// Extract coordinates (optional)
			const latitude = properties['Latitude']?.number;
			const longitude = properties['Longitude']?.number;

			// Extract address (optional)
			const address = properties['Address']?.rich_text?.[0]?.plain_text;

			// Must have either coordinates OR address
			if ((latitude === undefined || longitude === undefined) && !address) {
				errors.push(`Page ${page.id}: Must have either Latitude/Longitude OR Address`);
				continue;
			}

			// Extract name (prioritize Name field, then fall back to others)
			let name = 'Unnamed Location';

			// Look for Name field (case-insensitive)
			const nameKey = Object.keys(properties).find((key) => key.toLowerCase() === 'name');
			if (nameKey && properties[nameKey]?.title?.[0]?.plain_text) {
				name = properties[nameKey].title[0].plain_text;
			} else if (properties['Title']?.title?.[0]?.plain_text) {
				name = properties['Title'].title[0].plain_text;
			} else if (address) {
				name = address;
			}

			// Extract notes (optional)
			let notes: string | undefined;
			if (properties['Notes']?.rich_text?.[0]?.plain_text) {
				notes = properties['Notes'].rich_text[0].plain_text;
			}

			// Extract URL (optional)
			let url: string | undefined;
			if (properties['URL']?.url) {
				url = properties['URL'].url;
			}

			// Extract category (optional) - check for "Category" field (case-insensitive)
			let category: string | undefined;
			let categoryColor: string | undefined;

			// Look for Category field (case-insensitive)
			const categoryKey = Object.keys(properties).find((key) => key.toLowerCase() === 'category');

			if (
				categoryKey &&
				properties[categoryKey]?.type === 'select' &&
				properties[categoryKey]?.select
			) {
				category = properties[categoryKey].select!.name;
				categoryColor = properties[categoryKey].select!.color;
			}

			// If we have coordinates, use them directly
			if (latitude !== undefined && longitude !== undefined) {
				locations.push({
					name,
					lat: latitude,
					lng: longitude,
					notes,
					url,
					category,
					categoryColor
				});
			} else if (address) {
				// Try to geocode the address using Mapbox
				try {
					const geocodeResponse = await fetch(
						`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
							address
						)}.json?access_token=${PUBLIC_MAPBOX_TOKEN}&limit=1`,
						{
							headers: {
								'User-Agent': 'Notiography/1.0'
							}
						}
					);
					const geocodeData = await geocodeResponse.json();

					if (geocodeData && geocodeData.features && geocodeData.features.length > 0) {
						const location = geocodeData.features[0];
						locations.push({
							name,
							lat: location.center[1], // Mapbox returns [lng, lat]
							lng: location.center[0],
							notes,
							url,
							category,
							categoryColor
						});
					} else {
						errors.push(
							`Page ${page.id}: Could not geocode address "${address}". Please add Latitude/Longitude manually.`
						);
						continue;
					}
				} catch (geocodeError: any) {
					console.error('Geocoding error for', address, ':', geocodeError);
					errors.push(
						`Page ${page.id}: Geocoding failed for "${address}". Error: ${
							geocodeError?.message || 'Unknown error'
						}. Please add Latitude/Longitude manually.`
					);
					continue;
				}
			}
		}

		if (locations.length === 0) {
			return json(
				{
					error:
						'No valid locations found in database. Please ensure your database has either Latitude/Longitude OR Address properties.',
					details: errors.length > 0 ? errors : undefined
				},
				{ status: 400 }
			);
		}

		return json({
			locations,
			count: locations.length,
			errors: errors.length > 0 ? errors : undefined
		});
	} catch (error: any) {
		console.error('Notion API error:', error);

		if (error.code === 'unauthorized') {
			return json(
				{
					error:
						'Notion integration not authorized. Please share your database with the integration.'
				},
				{ status: 403 }
			);
		}

		if (error.code === 'object_not_found') {
			return json(
				{
					error:
						'Database not found. Please check your database ID and ensure the integration has access.'
				},
				{ status: 404 }
			);
		}

		return json(
			{ error: 'Failed to fetch data from Notion. Please check your configuration.' },
			{ status: 500 }
		);
	}
};
