<script lang="ts">
    import type { WebPlayback } from "svelte-spotify-web-playback";
	import KeyboardControlMap from "../hardware/KeyboardControlMap.svelte";

	export let wrapper: WebPlayback;
	export let clientName: string;
</script>

<KeyboardControlMap
	isActive={true}
	on:space={() => wrapper.selectDevice()}
	on:enter={() => wrapper.selectDevice()}
/>

<button on:click={() => wrapper.selectDevice()} class="connect-device-list-item"
	><div class="connect-device-list-item__icon">
		<svg
			role="img"
			height="32"
			width="32"
			class="device"
			data-testid="device-icon"
			viewBox="0 0 24 24"
			><path
				d="M0 21a1 1 0 011-1h22a1 1 0 110 2H1a1 1 0 01-1-1zM3 5a3 3 0 013-3h12a3 3 0 013 3v9a3 3 0 01-3 3H6a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v9a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H6z"
			/></svg
		>
	</div>
	<div class="connect-device-list-item__info">
		<div class="connect-device-title-hifi-container">
			{clientName}
		</div>
		<div class="connect-device-title-hifi-container">
            <div>
					<svg
						role="img"
						height="12"
						width="12"
						aria-hidden="true"
						viewBox="0 0 16 16"
						><path
							d="M14.5 8a6.468 6.468 0 00-1.3-3.9l1.2-.9C15.405 4.537 16 6.2 16 8c0 1.8-.595 3.463-1.6 4.8l-1.2-.9A6.468 6.468 0 0014.5 8zM8 1.5a6.5 6.5 0 103.25 12.13.75.75 0 11.75 1.3 8 8 0 110-13.86.75.75 0 11-.75 1.298A6.467 6.467 0 008 1.5z"
						/><path
							d="M11.259 8c0-.676-.228-1.296-.611-1.791l1.187-.918c.579.749.924 1.69.924 2.709a4.41 4.41 0 01-.925 2.709l-1.186-.918c.383-.495.61-1.115.61-1.791zM8.75 4.115l-4.139 2.39a1.727 1.727 0 000 2.99l4.139 2.39v-7.77z"
						/></svg
					>
                    <span>
                        Spotify Connect
                    </span>
		</div>
	</div>
</button>

<style lang="scss">
	svg {
		fill: currentcolor;
	}

	.connect-device-list-item {
		align-items: center;
		background-color: #282828;
		border: 0;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 10px 15px;
		position: relative;
		// width: 100%;
		color: #fff;

        // own non spotify styles
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: #333;
        }
	}

	.connect-device-list-item__icon {
		padding-right: 15px;
		color: #fff;
	}

	.connect-device-list-item__info {
		text-align: left;
		align-items: flex-start;
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.connect-device-title-hifi-container {
		align-items: center;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
</style>
