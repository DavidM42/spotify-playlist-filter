<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/** If keyboard shortcuts have recently been used */
	export let isKeyboardUsed: boolean = false;

	/** If should be listening to key events */
	export let isActive: boolean = true;

	const dispatch = createEventDispatcher();

	let debounceTimer: NodeJS.Timeout;
	/**
	 * Generic debounce helper
	 * @param func Function to debounce
	 * @param debounceTime Time in ms to debounce function to
	 */
	function debounce(func, debounceTime: number) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(func, debounceTime);
	}

	const onKeyDown = (event: KeyboardEvent) => {
		if (!isActive) {
			return;
		}

		// start showing keyboard hints and hide again after 10s of last use of keyboard
		isKeyboardUsed = true;
		debounce(() => {
			setTimeout(() => isKeyboardUsed = false, 10000);
		}, 5000);

		switch (event.key) {
			case 'ArrowRight':
				dispatch('rightStart');
				break;
			case 'ArrowLeft':
				dispatch('leftStart');
				break;
			}
	};

	const onKeyUp = (event: KeyboardEvent) => {
		if (!isActive) {
			return;
		}

		switch (event.key) {
			// add to playlist
			case 'Enter':
				dispatch('enter');
				break;

			// play/pause
			case ' ':
				dispatch('space');
				break;

			// 25% skip
			case 'Control':
				dispatch('ctrl');
				break;

			// for volume control
			case 'ArrowUp':
				dispatch('up');
				break;
			case 'ArrowDown':
				dispatch('down');
				break;

			// stop seeking
			case 'ArrowRight':
				dispatch('leftRightStop');
				break;
			case 'ArrowLeft':
				dispatch('leftRightStop');
				break;
		}
	};

	const onKeyPress = (event: KeyboardEvent) => {
		if (!isActive) {
			return;
		}

		switch (event.key) {
			// previous and next track
			case 'a':
				dispatch('a');
			case 'd':
				dispatch('d');
		}
	};
</script>

<svelte:body on:keydown={onKeyDown} on:keyup={onKeyUp} on:keypress={onKeyPress}/>

<style lang="scss">
</style>
