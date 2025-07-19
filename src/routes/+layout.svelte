<script lang="ts">
	import '../app.css';
	import Logo from '$lib/components/Logo.svelte';
	import { browser } from '$app/environment';

	// Detect if we're embedded in Notion
	let isEmbedded = false;

	if (browser) {
		// Check if we're in an iframe
		isEmbedded = window.self !== window.top;
	}
</script>

{#if !isEmbedded}
	<div class="logo">
		<Logo height={90} />
	</div>
{/if}

<main>
	<slot />
</main>
