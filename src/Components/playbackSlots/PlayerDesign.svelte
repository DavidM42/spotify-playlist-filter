<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import PlayPauseButton from '../playerDesign/PlayPauseButton.svelte';
	import ProgressBar from '../playerDesign/ProgressBar.svelte';
	import SkipButton from '../playerDesign/SkipButton.svelte';
	import TrackInformation from '../playerDesign/TrackInformation.svelte';
	import VolumeBar from '../playerDesign/VolumeBar.svelte';

	// state
    export let showGamepadButtons: boolean = false;
    export let showKeyboardButtons: boolean = false;
	export let isPaused: boolean;

	// playback
	export let currentTimeMs: number;
	export let maxTimeMs: number;
	export let volume: number;

	// info
	export let title: string;
	export let artist: string;
	export let imageUrl: string;

	const dispatch = createEventDispatcher();
</script>

<div class="player">
	<div class="track-info">
		<TrackInformation bind:title bind:artist bind:imageUrl />
	</div>
	<div class="status-and-control">
		<div class="control">
			<SkipButton mode="ADD" {showGamepadButtons} {showKeyboardButtons} on:click={() => dispatch('add')}/>
			<SkipButton mode="BACKWARD" {showGamepadButtons} {showKeyboardButtons} on:click={() => dispatch('skipBackward')} />
			<PlayPauseButton bind:isPaused {showGamepadButtons} {showKeyboardButtons} on:click={() => dispatch('playPause')} />
			<SkipButton mode="FORWARD" {showGamepadButtons} {showKeyboardButtons} on:click={() => dispatch('skipForward')}/>
			<SkipButton mode="FAST-FORWARD" {showGamepadButtons} {showKeyboardButtons} on:click={() => dispatch('fastForward')}/>
		</div>
		<div class="status">
			<ProgressBar bind:currentTimeMs bind:maxTimeMs />
			<div class="volume">
				<VolumeBar bind:volume/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.player {
		display: flex;
		width: 100%;

		.track-info {
            width: 25%;
			max-width: 350px;
		}

		.status-and-control {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			& > .control {
				width: 100%;
				display: flex;
				justify-content: center;

				margin-bottom: 5px;
			}

			& > .status {
				display: flex;
				width: 100%;

				> .volume {
					margin-left: 10px;
				}
			}
		}
	}
</style>
