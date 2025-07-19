<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<a
	href="https://github.com/tylercraft/notionography"
	target="_blank"
	rel="noopener noreferrer"
	class="watermark"
>
	<Logo height={12} />
	<span style="font-size: 8px;">Notionography</span>
</a>

<style>
	.watermark {
		position: fixed;
		bottom: 8px;
		right: 8px;
		background: rgba(255, 255, 255, 0.9);
		padding: 2px 6px;
		border-radius: 3px;
		font-size: 8px;
		color: #6b7280;
		display: flex;
		align-items: center;
		gap: 4px;
		z-index: 1000;
		backdrop-filter: blur(4px);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		opacity: 0.7;
		transition: opacity 0.2s;
		text-decoration: none;
		cursor: pointer;
	}

	.watermark:hover {
		opacity: 1;
	}
</style>
