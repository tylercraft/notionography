<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { browser } from '$app/environment';

	let mapContainer: HTMLDivElement;
	let map: any;
	let loading = true;
	let error: string | null = null;
	let locations: any[] = [];
	let isEmbedded = false;
	
	if (browser) {
		isEmbedded = window.self !== window.top;
		if (isEmbedded) {
			document.body.classList.add('embedded');
		}
	}

	onMount(async () => {
		if (!PUBLIC_MAPBOX_TOKEN) {
			error = 'Mapbox token not configured. Please set PUBLIC_MAPBOX_TOKEN in your environment.';
			loading = false;
			return;
		}

		const databaseId = $page.url.searchParams.get('db');
		if (!databaseId) {
			error = 'No database ID provided. Please add ?db= parameter to the URL.';
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

			// Store locations and let reactive statement handle map initialization
			locations = result.locations;
			loading = false;
		} catch (err) {
			console.error('Error loading map:', err);
			error = 'Failed to load map. Please check your configuration.';
			loading = false;
		}
	});

	async function initializeMap(locations: any[]) {
		// Dynamically import mapbox-gl
		const mapboxgl = await import('mapbox-gl');
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		// Ensure container exists
		if (!mapContainer) {
			throw new Error('Map container not found');
		}

		// Calculate bounds
		const bounds = new mapboxgl.LngLatBounds();
		locations.forEach((location) => {
			bounds.extend([location.lng, location.lat]);
		});

		// Create map
		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/light-v11',
			bounds: bounds,
			fitBoundsOptions: {
				padding: 50,
				maxZoom: 14 // Prevent zooming in too close
			}
		});

		// Add navigation controls
		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		// Add markers for each location
		locations.forEach((location) => {
			// Create marker element
			const markerEl = document.createElement('div');
			markerEl.className = 'marker';
			markerEl.style.width = '20px';
			markerEl.style.height = '20px';
			markerEl.style.borderRadius = '50%';
			markerEl.style.backgroundColor = '#3b82f6';
			markerEl.style.border = '2px solid white';
			markerEl.style.cursor = 'pointer';

			// Create popup
			const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
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

	// Reactive statement to initialize map when container and locations are ready
	$: if (mapContainer && locations.length > 0 && !map) {
		initializeMap(locations);
	}
</script>

<svelte:head>
			<title>Notionography Map</title>
</svelte:head>

{#if loading}
	<div class="loading">Loading map...</div>
{:else if error}
	<div class="error-message">
		<h2>Error</h2>
		<p>{error}</p>
		<a href="/" class="back-link">← Back to Home</a>
	</div>
{:else}
	<div bind:this={mapContainer} class="map-container" />
{/if}

<style>
	.map-container {
		width: 100%;
		height: calc(100vh - 80px);
		position: relative;
	}
	
	/* Full height when embedded */
	:global(.embedded) .map-container {
		height: 100vh;
	}
	
	.back-link {
		display: inline-block;
		margin-top: 1rem;
		color: #3b82f6;
		text-decoration: none;
		font-weight: 600;
	}

	.back-link:hover {
		text-decoration: underline;
	}
	

</style>
