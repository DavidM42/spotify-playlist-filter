<script lang="ts">
    import type { WebPlayback } from "svelte-spotify-web-playback";

    import Loading from "./Loading.svelte";
    import KeyboardControlMap from "../hardware/KeyboardControlMap.svelte";

    export let wrapper: WebPlayback;

    /**
     * Promise to await Spotify SDK to load before logging in.
     * Thx to https://stackoverflow.com/a/30507964
     * @param timeout Timeout in milliseconds
     */
    function ensureSpotifyExists(timeout: number) {
        const start = Date.now();
        return new Promise(waitForSpotify);
        function waitForSpotify(resolve, reject) {
            if (window.Spotify)
                resolve(window.Spotify);
            else if (timeout && (Date.now() - start) >= timeout)
                reject(new Error('Spotify SDK was not loaded within ' + timeout / 1000 + 'seconds.\nCheck if your browser blocks requests to spotify or if you are offline.'));
            else
                setTimeout(waitForSpotify.bind(this, resolve, reject), 30);
        }
    }
</script>

<KeyboardControlMap
	isActive={true}
	on:space={() => wrapper.login()}
	on:enter={() => wrapper.login()}
/>

{#await ensureSpotifyExists(20000)}
	<Loading />
{:then spotifyObj}
	<button on:click={() => wrapper.login()}> Log in to Spotify </button>
{:catch error}
	<span id="error">{error}</span>
{/await}

<style lang="scss">
	button {
		background-color: #fff;
		color: #181818;

		border: 2px solid transparent;
		border-radius: 500px;
		cursor: pointer;
		display: inline-block;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 1.76px;
		line-height: 18px;
		padding: 8px 34px;
		text-align: center;
		text-transform: uppercase;
		transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
		white-space: nowrap;
		will-change: transform;

		&:hover {
			transform: scale(1.06);
		}
	}

    #error {
        text-align: center;
        white-space: pre-line;
        color: #ff0000;
    }

</style>
