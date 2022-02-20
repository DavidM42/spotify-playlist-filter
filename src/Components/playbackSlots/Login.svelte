<script lang="ts">
    import type { WebPlayback } from "svelte-spotify-web-playback";

    import KeyboardControlMap from "../hardware/KeyboardControlMap.svelte";

    export let wrapper: WebPlayback;
</script>

<KeyboardControlMap
	isActive={true}
	on:space={() => wrapper.login()}
	on:enter={() => wrapper.login()}
/>

<button on:click={() => wrapper.login()}>
    Log in to Spotify
</button>

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
        transition: all 33ms cubic-bezier(.3,0,0,1);
        white-space: nowrap;
        will-change: transform;

        &:hover {
            transform: scale(1.06);
        }
    }
</style>