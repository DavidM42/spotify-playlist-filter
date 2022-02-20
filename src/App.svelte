<script lang="ts">
	import { WebPlayback } from 'svelte-spotify-web-playback';

    import { appName, scopes, client_id } from './definitions/constants';
	import Loading from './Components/playbackSlots/Loading.svelte';
	import Login from './Components/playbackSlots/Login.svelte';
	import PlayerComponent from './Components/playbackSlots/PlayerComponent.svelte';
	import SelectDevice from './Components/playbackSlots/SelectDevice.svelte';

	let wrapper: WebPlayback;
</script>

<svelte:head>
    <title>{appName}</title>
</svelte:head>

<div id="container">
	<!-- TODO i18n -->
	<h1>Welcome to Skimify</h1>
	<span class="description">
		A tool to quickly skim through songs in playlists and add them to your own preffered playlist
	</span>

	<WebPlayback {client_id} bind:this={wrapper} {scopes} name={appName}>
		<Login slot="login" {wrapper} />
		<Loading slot="loading" />
		<SelectDevice slot="waiting" {wrapper} clientName={appName} />

		<!-- TODO if already playing on some device then allow to continue playing there while using it -->

		<!-- Custom element usage -->
		<PlayerComponent slot="player" let:player let:state {player} {state} />
	</WebPlayback>
</div>

<style lang="scss">
	@import './definitions/styles/encore-colors.scss';

	:global(body) {
		color: var(--text-base);
		background-color: var(--background-base);
        // expensive license to buy circular font sooo montserra it is
		// font-family: spotify-circular, Helvetica Neue, helvetica, arial, Hiragino Kaku Gothic Pro, Meiryo, MS Gothic, sans-serif;
		font-family: Montserrat, Helvetica Neue, helvetica, arial, Hiragino Kaku Gothic Pro, Meiryo, MS Gothic, sans-serif;

		display: flex;
		justify-content: center;

		// no scrolling
		margin: 0;
		height: 100%;
		overflow: hidden;
	}

	.description {
		margin-bottom: 20px;
		color: var(--text-subdued, #6a6a6a);
		text-align: center;
	}

	#container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 95vw;
		margin-top: 10vh;
	}
</style>
