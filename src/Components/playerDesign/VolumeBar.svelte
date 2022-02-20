<script lang="ts">
	import IoIosVolumeHigh from 'svelte-icons/io/IoIosVolumeHigh.svelte';
	import IoIosVolumeLow from 'svelte-icons/io/IoIosVolumeLow.svelte';
	import IoIosVolumeMute from 'svelte-icons/io/IoIosVolumeMute.svelte';

	export let volume: number;
</script>

<div id="volume-wrapper">
	<div id="volume-icon">
		{#if volume === 0}
			<IoIosVolumeMute/>
		{:else if volume <= 0.5}
			<IoIosVolumeLow/>
		{:else}
			<IoIosVolumeHigh/>
		{/if}
	</div>
	<div id="volumebar-wrapper">
		<!-- could be refactored with https://svelte.dev/tutorial/tweened -->
		<div id="volumebar">
			<div style="width: {volume * 100}%;" />
		</div>
	</div>
</div>

<style lang="scss">
	@import '../../definitions/styles/encore-colors.scss';

	#volume-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-content: center;
	}

	#volume-icon {
		height: 16px;
	}

	#volumebar-wrapper {
		width: 100px;
		display: flex;

		// thx https://stackoverflow.com/a/7191095
		& #volumebar {
			--bg-color: #535353;
			--fg-color: #b3b3b3;
			--is-active-fg-color: #1db954;
			--progress-bar-transform: 0%;
			--progress-bar-height: 4px;
			--progress-bar-radius: calc(var(--progress-bar-height) / 2);

			background-color: var(--bg-color);
			border-radius: var(--progress-bar-radius);
			height: var(--progress-bar-height);
			width: 100%;
			margin: 5px;

			& > div {
				background-color: var(--fg-color);
				width: 40%;
				height: var(--progress-bar-height);
				border-radius: 10px;
			}
		}
	}
</style>
