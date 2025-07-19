<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<div class="watermark">
	<Logo height={16} />
	<span>Notionography</span>
</div>

<style>
	.watermark {
		position: fixed;
		bottom: 8px;
		right: 8px;
		background: rgba(255, 255, 255, 0.9);
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 10px;
		color: #6b7280;
		display: flex;
		align-items: center;
		gap: 4px;
		z-index: 1000;
		backdrop-filter: blur(4px);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.watermark:hover {
		opacity: 1;
	}
</style>
