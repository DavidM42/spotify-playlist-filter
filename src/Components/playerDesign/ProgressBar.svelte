<script lang="ts">
	export let currentTimeMs: number;
	export let maxTimeMs: number;

	function millisToMinutesAndSeconds(millis) {
		// thx https://stackoverflow.com/a/21294619
		const minutes = Math.floor(millis / 60000);
		const seconds = Number.parseInt(((millis % 60000) / 1000).toFixed(0));
		return (seconds === 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
	}
</script>

<div id="progressbar-wrapper">
	<span class="time-status">{ millisToMinutesAndSeconds(currentTimeMs)}</span>
	<div id="progressbar">
		<!-- could be refactored with https://svelte.dev/tutorial/tweened -->
		<div style="width: {Math.min(currentTimeMs / maxTimeMs * 100, 100)}%;"></div>
	</div>
	<span class="time-status">{ millisToMinutesAndSeconds(maxTimeMs)}</span>
</div>

<style lang="scss">
    @import "../../definitions/styles/encore-colors.scss";

	#progressbar-wrapper {
		width: 100%;
		min-width: 250px;
		display: flex;
	}

	.time-status {
		font-size: 0.6875rem;
		letter-spacing: normal;
		box-sizing: border-box;
		margin-top: 0px;
		margin-bottom: 0px;
		line-height: 1rem;
		font-weight: 400;
		color: var(--text-subdued,#6a6a6a);
	}

    // thx https://stackoverflow.com/a/7191095
	#progressbar {
		// border-radius: 13px;
		/* (height of inner div) / 2 + padding */
		// padding: 3px;

		--bg-color: #535353;
		--fg-color: #b3b3b3;
		--is-active-fg-color: #1db954;
		--progress-bar-transform: 0%;
		--progress-bar-height: 4px;
		--progress-bar-radius: calc(var(--progress-bar-height)/2);

		background-color: var(--bg-color);
		border-radius: var(--progress-bar-radius);
		height: var(--progress-bar-height);
		width: 100%;
		margin: 5px;
	}

	#progressbar > div {
		background-color: var(--fg-color);
		width: 40%;
		height: var(--progress-bar-height);
		border-radius: 10px;
	}
</style>
