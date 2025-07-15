<script lang="ts">
	import '../app.css';
	import Logo from '$lib/components/Logo.svelte';
</script>

<div class="logo">
	<Logo height={90} />
</div>

<main>
	<slot />
</main>
