<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { browser } from '$app/environment';
	import Watermark from '$lib/components/Watermark.svelte';
	import Logo from '$lib/components/Logo.svelte';

	let mapContainer: HTMLDivElement;
	let map: any;
	let loading = true;
	let error: string | null = null;
	let isEmbedded = false;
	
	if (browser) {
		isEmbedded = window.self !== window.top;
	}

	onMount(async () => {
		if (!PUBLIC_MAPBOX_TOKEN) {
			error = 'Mapbox token not configured.';
			loading = false;
			return;
		}

		const databaseId = $page.url.searchParams.get('db');
		if (!databaseId) {
			error = 'No database ID provided.';
			loading = false;
			return;
		}

		try {
			// Fetch location data
			const response = await fetch(`/api/locations?db=${encodeURIComponent(databaseId)}`);
			const result = await response.json();

			if (!response.ok) {
				error = result.error || 'Failed to fetch location data.';
				loading = false;
				return;
			}

			if (!result.locations || result.locations.length === 0) {
				error = 'No locations found in the database.';
				loading = false;
				return;
			}

			// Initialize Mapbox
			await initializeMap(result.locations);
		} catch (err) {
			console.error('Error loading map:', err);
			error = 'Failed to load map.';
			loading = false;
		}
	});

	async function initializeMap(locations: any[]) {
		// Dynamically import mapbox-gl
		const mapboxgl = await import('mapbox-gl');
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		// Calculate bounds
		const bounds = new mapboxgl.LngLatBounds();
		locations.forEach((location) => {
			bounds.extend([location.lng, location.lat]);
		});

		// Create map with embed-specific settings
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/light-v11',
			bounds: bounds,
			fitBoundsOptions: {
				padding: 20,
				maxZoom: 14 // Prevent zooming in too close
			},
			interactive: true,
			attributionControl: false
		});

		// Add markers for each location
		locations.forEach((location) => {
			// Create marker element
			const markerEl = document.createElement('div');
			markerEl.className = 'marker';
			markerEl.style.width = '16px';
			markerEl.style.height = '16px';
			markerEl.style.borderRadius = '50%';
			markerEl.style.backgroundColor = '#3b82f6';
			markerEl.style.border = '2px solid white';
			markerEl.style.cursor = 'pointer';

			// Create popup
			const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(`
				<div class="popup">
					<h3>${location.name}</h3>
					${location.notes ? `<p>${location.notes}</p>` : ''}
					<p><small>${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</small></p>
				</div>
			`);

			// Add marker to map
			new mapboxgl.Marker(markerEl)
				.setLngLat([location.lng, location.lat])
				.setPopup(popup)
				.addTo(map);
		});

		loading = false;
	}
</script>

<svelte:head>
			<title>Notionography Map</title>
	<style>
		body {
			margin: 0;
			padding: 0;
			overflow: hidden;
		}
	</style>
</svelte:head>

{#if loading}
	<div class="loading">Loading map...</div>
{:else if error}
	<div class="error-message">
		<p>{error}</p>
	</div>
{:else}
	<div bind:this={mapContainer} class="map-container" />
	{#if isEmbedded}
		<Watermark />
		<div class="embedded-logo">
			<Logo height={32} />
		</div>
	{/if}
{/if}

<style>
	.map-container {
		width: 100vw;
		height: 100vh;
		position: relative;
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		font-size: 1rem;
		color: #6b7280;
	}

	.error-message {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		text-align: center;
		padding: 2rem;
		color: #dc2626;
	}
	
	.embedded-logo {
		position: fixed;
		top: 8px;
		left: 8px;
		background: rgba(255, 255, 255, 0.9);
		padding: 4px 8px;
		border-radius: 4px;
		z-index: 1000;
		backdrop-filter: blur(4px);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
