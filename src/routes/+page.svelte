<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let databaseId = '';

	function handleSubmit() {
		if (databaseId.trim()) {
			goto(`/map?db=${encodeURIComponent(databaseId.trim())}`);
		}
	}
</script>

<div class="container">
	<div class="welcome">
		<p>Create beautiful maps from your Notion databases</p>

		<div class="form">
			<label for="database-id">Notion Database ID:</label>
			<input
				type="text"
				id="database-id"
				bind:value={databaseId}
				placeholder="Enter your Notion database ID"
				on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
			/>
			<button on:click={handleSubmit}>View Map</button>
		</div>

		<div class="instructions">
			<h3>How to use:</h3>
			<ol>
				<li>
					Create a Notion database with these properties:
					<ul>
						<li><strong>Latitude</strong> (Number) - Required if no Address</li>
						<li><strong>Longitude</strong> (Number) - Required if no Address</li>
						<li>
							<strong>Address</strong> (Text) - Required if no Lat/Lng (geocoding coming soon)
						</li>
						<li><strong>Notes</strong> (Rich Text) - Optional</li>
					</ul>
				</li>
				<li>Share your database with your Notion integration</li>
				<li>Copy the database ID from the URL</li>
				<li>Enter it above and click "View Map"</li>
			</ol>
		</div>
	</div>
</div>

<style>
	.welcome {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem 0;
		text-align: center;
	}

	p {
		font-size: 1.2rem;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.form {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	label {
		font-weight: 600;
		color: #374151;
	}

	input {
		padding: 0.75rem 1rem;
		border: 2px solid #d1d5db;
		border-radius: 8px;
		font-size: 1rem;
		width: 100%;
		max-width: 400px;
	}

	input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	button {
		padding: 0.75rem 2rem;
		background-color: #3b82f6;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #2563eb;
	}

	.instructions {
		text-align: left;
		margin-top: 3rem;
		padding: 2rem;
		background-color: #f9fafb;
		border-radius: 8px;
	}

	.instructions h3 {
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.instructions ol {
		padding-left: 1.5rem;
	}

	.instructions li {
		margin-bottom: 0.5rem;
	}

	.instructions ul {
		margin: 0.5rem 0 1rem 1.5rem;
	}

	.instructions strong {
		color: #1f2937;
	}
</style>
