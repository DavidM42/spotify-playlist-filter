<script lang="ts">
	import { fade } from 'svelte/transition';

	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import SpotifyWebApi from 'spotify-web-api-js';
	import FaLongArrowAltRight from 'svelte-icons/fa/FaLongArrowAltRight.svelte'
	import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte'

	import GamepadControlMap from '../hardware/GamepadControlMap.svelte';
	import KeyboardControlMap from '../hardware/KeyboardControlMap.svelte';
	import PlayerDesign from './PlayerDesign.svelte';
	import PlaylistSearchAutocomplete from '../PlaylistSearchAutocomplete.svelte';

	export let player: WebPlaybackPlayer;
	export let state: WebPlaybackState;
	let isGamepadUsed: boolean = false;
	let isKeyboardUsed: boolean = false;
	let activateKeyboardListener = true;

	const checkForPlaylistEnd = () => {
		// had tip here but does not work :(
		// TODO fix prevent auto play and notify user that he has finished playlist
		// https://github.com/spotify/android-sdk/issues/90#issuecomment-509987849
		if (state.context.uri && !(state.context.uri as any).includes('playlist')) {
			// if context exists but is not a playlist then probably auto plays or something so stop it
			player.pause();
			sourcePlaylist = undefined;
			toast.push('Playlist finished. Good job! On to the next one', successToastOptions);
		}
	}
	player.addListener('player_state_changed', checkForPlaylistEnd)

	/**
	 * Every half second this variable get's assigned the current track position.
	 * Is need for change detection.
	 * Kinda cumbersome but change detection on state prop does not work good enough for binding apparently.
	*/
	let currentTimeEveryHalfSecondInMs = 0;
	const updateCurrentTimeEveryHalfSecondInMs = async () => {
		// TODO maybe find smarter way of change detection to do this
		currentTimeEveryHalfSecondInMs = (await player.getCurrentState()).position
		// checkForPlaylistEnd();
		setTimeout(updateCurrentTimeEveryHalfSecondInMs, 500);
	}
	updateCurrentTimeEveryHalfSecondInMs();


	/** If under 0 then start seeking backwards if over 1 then forwards */
	let seekRequestDirection = 0;

	const successToastOptions = {
		duration: 3500,
		pausable: true,
		theme: {
			'--toastBackground': '#1ed760',
			'--toastColor': '#000',
			'--toastBarBackground': '#000'
		}
	};

	const errorToastOptions = {
		duration: 3500,
		pausable: true,
		theme: {
			'--toastBackground': 'var(--essential-negative,#e91429)',
			'--toastColor': '#fff',
			'--toastBarBackground': '#fff'
		}
	};

	let spotifyApi = new SpotifyWebApi();
	let token: string;
	let meUserId: string;

	// have to always await this promise before using the spotifyApi
	let loadingToken = new Promise<string>((resolve) => {
		player._options.getOAuthToken(async (t) => {
			token = t;
			spotifyApi.setAccessToken(token);

			// get my own user id
			const me = await spotifyApi.getMe();
			meUserId = me.id;
			resolve(token);
		});
	});

	const nextPosition = () => {
		const trackTime = state.track_window.current_track.duration_ms;
		// 25% in, 50% in, 75% in
		const seekPositions = [trackTime / 4, (trackTime / 4) * 2, (trackTime / 4) * 3];

		const nextPos = seekPositions.find((pos) => pos > state.position);

		if (!nextPos) {
			player.nextTrack();
		} else {
			player.seek(nextPos);
		}
	};

	/** Playlist to rip tracks from */
	const SOURCE_PLAYLIST_KEY = 'sourcePlaylist';
	let savedSourcePlaylist = JSON.parse(localStorage.getItem(SOURCE_PLAYLIST_KEY));
	let sourcePlaylist: SpotifyApi.PlaylistObjectSimplified = savedSourcePlaylist || undefined;

	/** Own or collaborative playlist to rip tracks into*/
	const TARGET_PLAYLIST_KEY = 'targetPlaylist';
	let savedTargetPlaylist = JSON.parse(localStorage.getItem(TARGET_PLAYLIST_KEY));
	let targetPlaylist: SpotifyApi.PlaylistObjectSimplified = savedTargetPlaylist || undefined;

	// playlist defaults to load at start get latest
	let sourcePlaylistsPreloadItems: SpotifyApi.PlaylistObjectSimplified[] = [];
	let targetPlaylistsPreloadItems: SpotifyApi.PlaylistObjectSimplified[] = [];
	const loadPlaylistDefaults = async () => {
		if (!sourcePlaylist) {
			// does not make much sense right now since mostly returns self created playlists
			// sourcePlaylistsItems = await searchPlaylists();
		}
		if (!targetPlaylist) {
			targetPlaylistsPreloadItems = await searchEditablePlayists();
		}
	};
	loadPlaylistDefaults();


	let initialPlay = true;

	async function searchPlaylists(keywords?: { filtered?: string, unfiltered?: string}) {
		await loadingToken;

		let items: SpotifyApi.PlaylistObjectSimplified[];
		if (keywords.unfiltered) {
			if (keywords.unfiltered.includes('https://open.spotify.com/playlist/')) {
				const playlistId = keywords.unfiltered.replace('https://open.spotify.com/playlist/', '').split('?')[0];
				const playlist = await spotifyApi.getPlaylist(playlistId)
				items = [playlist];
			} else if (keywords.unfiltered.includes('spotify:playlist:')) {
				const playlistId = keywords.unfiltered.replace('spotify:playlist:', '');
				const playlist = await spotifyApi.getPlaylist(playlistId)
				items = [playlist];
			} else {
				// use filtered keywords here for raw search via api
				const playlists = await spotifyApi.searchPlaylists(keywords.filtered, {});
				items = playlists.playlists.items;
			}
		} else {
			const playlists = await spotifyApi.getUserPlaylists(meUserId, {limit: 50});
			items = playlists.items;			
		}

		return items;
	}

	async function searchEditablePlayists(keywords?: { filtered?: string, unfiltered?: string}) {
		const items = await searchPlaylists(keywords);

		// only show collaborative playlists or my own playlists
		const editableItems = items.filter((item) => item.owner.id === meUserId || item.collaborative);
		return editableItems;
	}

	const togglePlayback = async () => {
		await loadingToken;

		if (initialPlay) {
			initialPlay = false;
			spotifyApi.play({ context_uri: sourcePlaylist.uri });
		} else {
			player.togglePlay();
		}
	};

	const addToTargetPlaylistThenSkip = async () => {
		await loadingToken;

		spotifyApi
			.addTracksToPlaylist(targetPlaylist.id, [state.track_window.current_track.uri])
			.then(() => {
				toast.push(`Added to\n "${targetPlaylist.name}"!`, successToastOptions);
			});
		player.nextTrack();
	};

	/**
	 * Deactivate keyboard listeners while in input fields to type
	 */
	const onStartInput = () => {
		activateKeyboardListener = false;
	}

	/** is true when ui should give user extra obious play button to get going. Otherwise false */
	let hintAtPlayStart = false;;

	/**
	 * Check on select if both have been selected and auto starts playback
	 */
	const onFinishedInput = async (event: CustomEvent<SpotifyApi.PlaylistObjectSimplified>) => {
		// since we now only hint at it now autplay directly this is not needed atm
		// if (event.detail.id === savedSourcePlaylist.id || event.detail.id === savedTargetPlaylist.id) {
			// dont autostart playback when previously saved playlists were auto selected
			// return;
		// }

		activateKeyboardListener = true;
		await loadingToken;

		// save the selected playlists to localstorage for next load
		if (sourcePlaylist) {
			localStorage.setItem(SOURCE_PLAYLIST_KEY, JSON.stringify(sourcePlaylist));
		}
		if (targetPlaylist) {
			localStorage.setItem(TARGET_PLAYLIST_KEY, JSON.stringify(targetPlaylist));
		}

		if (sourcePlaylist && targetPlaylist) {
			console.log('All playlists selected. Hinting play start now.');
			hintAtPlayStart = true;
		}
	};

	// skip by 5 second intervals
	const seekSkipOffset = 10000;
	const conditionalSeek = async (inputSeekRequestDirection?: number) => {
		// also allow to override current active value here in first execution
		// allows for easy use of this function in event bindings
		if (inputSeekRequestDirection) {
			seekRequestDirection = inputSeekRequestDirection;
		}

		if (seekRequestDirection !== 0) {
			// seek in 5s intervals for now
			await player.seek(state.position + seekSkipOffset * seekRequestDirection);
			setTimeout(() => conditionalSeek(), 200);
		}
	};

	let keptVolume = 0;
	player.getVolume().then((v) => {
		keptVolume = v;
	});
	const volumeChange = async (changeByPercent: number, suppressWarning = false) => {
		const retrievedVolume = await player.getVolume();
		let wantedVolume = (retrievedVolume * 100) + changeByPercent;

		const cantGetLower = wantedVolume < 0 && retrievedVolume === 0;
		const cantGetHigher = wantedVolume > 100 && retrievedVolume === 1;
		if (cantGetHigher || cantGetLower) {
			if (!suppressWarning) {
				toast.push(`Volume can't be ${wantedVolume > 0 ? 'higher than 100%' : 'lower than 0%'}`, errorToastOptions);
			}
		} else {
			if (wantedVolume > 100) {
				wantedVolume = 100;
			} else if (wantedVolume < 0) {
				wantedVolume = 0;
			}
			player.setVolume(wantedVolume / 100);
			keptVolume = wantedVolume / 100;
			console.log(`Volume now at ${wantedVolume}%`);
		}
	}
</script>

<GamepadControlMap
	bind:isGamepadUsed
	on:A_Pressed={() => togglePlayback()}
	on:LB_Pressed={() => player.previousTrack()}
	on:RB_Pressed={() => player.nextTrack()}
	on:X_Pressed={() => nextPosition()}
	on:Y_Pressed={() => addToTargetPlaylistThenSkip()}
	on:DPadUp_Pressed={() => volumeChange(10)}
	on:DPadDown_Pressed={() => volumeChange(-10)}
	on:LeftStickX={(event) => conditionalSeek(event.detail)}
	on:LeftStickXCenter={() => (seekRequestDirection = 0)}
	on:RightStickY={(event) => volumeChange(event.detail * 50, true)}
/>

<KeyboardControlMap
	bind:isKeyboardUsed
	isActive={activateKeyboardListener}
	on:space={() => togglePlayback()}
	on:shift={() => nextPosition()}
	on:enter={() => addToTargetPlaylistThenSkip()}
	on:up={() => volumeChange(10)}
	on:down={() => volumeChange(-10)}
	on:a={() => player.previousTrack()}
	on:d={() => player.nextTrack()}
	on:rightStart={() => conditionalSeek(0.5)}
	on:leftStart={() => conditionalSeek(-0.5)}
	on:leftRightStop={() => seekRequestDirection = 0}
/>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

<div id="player-container">
	<div id="playlist-selection-container">
		<div class="playlist-selection">
			<PlaylistSearchAutocomplete
				placeholder="Search for source playlist"
				bind:items={sourcePlaylistsPreloadItems}
				searchFunction={searchPlaylists}
				bind:selectedItem={sourcePlaylist}
				on:change={onFinishedInput}
				on:focus={onStartInput}
			/>
		</div>

		<div class="between-playlists">
			{#if hintAtPlayStart}
				<div class="start-hint" in:fade on:click={() => {
					hintAtPlayStart = false;
					togglePlayback();
				}}>
					<IoIosPlay/>
				</div>
			{:else}
				<div class="playlist-direction-arrow" in:fade>
					<FaLongArrowAltRight/>
				</div>
			{/if}
		</div>


		<div class="playlist-selection">
			<PlaylistSearchAutocomplete
				placeholder="Search your own playlist to append track to"
				bind:items={targetPlaylistsPreloadItems}
				searchFunction={searchEditablePlayists}
				bind:selectedItem={targetPlaylist}
				on:change={onFinishedInput}
				on:focus={onStartInput}
			/>
		</div>
	</div>

	{#if sourcePlaylist && targetPlaylist}
		<PlayerDesign
			isPaused={state.paused}
			title={state.track_window.current_track.name}
			artist={state.track_window.current_track.artists[0].name}
			imageUrl={state.track_window.current_track.album.images[0].url}
			bind:showGamepadButtons={isGamepadUsed}
			bind:showKeyboardButtons={isKeyboardUsed}
			bind:volume={keptVolume}
			currentTimeMs={currentTimeEveryHalfSecondInMs}
			maxTimeMs={state.duration}
			on:playPause={() => togglePlayback()}
			on:skipBackward={() => player.previousTrack()}
			on:skipForward={() => player.nextTrack()}
			on:fastForward={() => nextPosition()}
			on:add={() => addToTargetPlaylistThenSkip()}
		/>
	{/if}
</div>

<style lang="scss">
	#player-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;

		// sizing
		max-width: 1024px;
		width: 100%;

		& > #playlist-selection-container {
			width: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;

			margin-bottom: 100px;

			& .between-playlists {
				color: var(--essential-bright-accent, #1ed760);

				// all the inner wrappers of custom component icons
				& div {
					height: 56px;
					width: auto;
					
					// center svg too 
					display: flex;
					justify-content: center;
					align-content: center;
				}

				& .start-hint {
					cursor: pointer;

					&:hover {
						transform: scale(1.06);
						transition: none 33ms cubic-bezier(.3,0,0,1);
							transition-property: none;
						transition-property: all;
					}
				}
			}
		}
	}

	// :root {
	// 	// position toast at bottom but off again for now
	// 	--toastContainerTop: auto;
	// 	--toastContainerRight: auto;
	// 	--toastContainerBottom: 8rem;
	// 	--toastContainerLeft: calc(50vw - 8rem);
	// }
</style>
