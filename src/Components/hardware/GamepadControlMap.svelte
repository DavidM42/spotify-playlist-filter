<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Gamepad from 'svelte-gamepad';

	/** If gamepad bindings have recently been used */
	export let isGamepadUsed: boolean = false;

	export let isGamepadConnected: boolean = false;

	const dispatch = createEventDispatcher();

	/** Only have once vibrationActuator process running at once */
	let runningVibrationActuator = false;

	const vibrateDeviceAndGamepad = (durationMs: number) => {
		navigator.vibrate(durationMs);

		const gamepad: any = navigator.getGamepads()[0];
		if (gamepad.vibrationActuator) {
			// chrome api
			// thx https://codepen.io/siddv/pen/wEdewG
			// and https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator/playEffect
			if (!runningVibrationActuator) {
				runningVibrationActuator = true;
				console.log('Vibrating for', durationMs, 'ms');
				debugger;
				gamepad.vibrationActuator.playEffect('dual-rumble', {
					duration: durationMs,
					weakMagnitude: 1.0,
					strongMagnitude: 1.0,
				}).then(() => {
					console.log('Vibration finished');
					runningVibrationActuator = false;
				});
			}
		} else if(gamepad.hapticActuators?.length >= 1) {
			// firefox api apparently
			// https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator/pulse
			// does not work in my testing though
			gamepad.hapticActuators[0].pulse(1.0, durationMs);
		}
	}

	/* Gamepad */
	let debounceTimers = {};

	/**
	 * Generic debounce helper
	 * @param key Key to use multiple different debouncers at once
	 * @param func Function to debounce
	 * @param debounceTime Time in ms to debounce function to
	 */
	function debounce(key: string, func, debounceTime: number) {
		clearTimeout(debounceTimers[key]);
		debounceTimers[key] = setTimeout(func, debounceTime);
	}

	let leftAxis = { x: 0, y: 0 };
	let rightAxis = { x: 0, y: 0 };

	const gamepadConnected = (event) => {
		console.log(`app: gamepad ${event.detail.gamepadIndex} connected`);
		isGamepadConnected = true;
	}

	/** Debounce button press events and vibrate if possible */
	function buttonPressed(eventName: string, vibrationLength?: number) {
		// start showing gamepad hints and hide again after 20s of last use of
		isGamepadUsed = true;
		debounce('useTime',() => {
			setTimeout(() => isGamepadUsed = false, 7500);
		}, 7500);

		debounce(eventName, () => {
			if (vibrationLength) {
				vibrateDeviceAndGamepad(vibrationLength);
			}
			dispatch(eventName);
		}, 200);
	}

	function LeftStick(event) {
		// check for deadzone bigger than 0.3 and also if changed enough since last move
		const significantXDiff = Math.abs(leftAxis.x - event.detail.x) > 0.25;
		const significantYDiff = Math.abs(leftAxis.y - event.detail.y) > 0.25;
		
		if (Math.abs(leftAxis.x) <= 0.2) {
			leftAxis = event.detail;
			// if smaller than stick deadzone, reset
			dispatch('LeftStickXCenter');

		// TODO disabled for now because activating this breaks x axis code
		// } else if (Math.abs(leftAxis.y) <= 0.2) {
		// 	leftAxis = event.detail;
		// 	// if smaller than stick deadzone, reset
		// 	vibrateDeviceAndGamepad(50);
		// 	dispatch('LeftStickYCenter');
		} else if (significantXDiff) {
			leftAxis = event.detail;
			vibrateDeviceAndGamepad(50);
			dispatch('LeftStickX', leftAxis.x);
		} else if (significantYDiff) {
			leftAxis = event.detail;
			vibrateDeviceAndGamepad(50);
			dispatch('LeftStickY', leftAxis.y);
		}
	}

	// TODO less repetitive code with left stick
	function RightStick(event) {
		// check for deadzone bigger than 0.3 and also if changed enough since last move
		const significantXDiff = Math.abs(rightAxis.x - event.detail.x) > 0.25;
		const significantYDiff = Math.abs(rightAxis.y - event.detail.y) > 0.25;
		
		// if (Math.abs(rightAxis.x) <= 0.2) {
		// 	rightAxis = event.detail;
		// 	// if smaller than stick deadzone, reset
		// 	vibrateDeviceAndGamepad(50);
		// 	dispatch('RightStickXCenter');
		// }
		if (Math.abs(rightAxis.y) <= 0.2) {
			rightAxis = event.detail;
			// if smaller than stick deadzone, reset
			dispatch('RightStickYCenter');
		} else if (significantXDiff) {
			rightAxis = event.detail;
			vibrateDeviceAndGamepad(50);
			dispatch('RightStickX', rightAxis.x);
		} else if (significantYDiff) {
			rightAxis = event.detail;
			vibrateDeviceAndGamepad(50);
			console.log(rightAxis.y)
			dispatch('RightStickY', rightAxis.y);
		}
	}
</script>

<!-- TODO why does dpad not work in firefox?? still bug? https://bugzilla.mozilla.org/show_bug.cgi?id=1464940 -->
<!-- TODO tweak vibration feedback timing and hardness here a bit -->
<Gamepad
	on:Connected={gamepadConnected}
	gamepadIndex={0}
	on:A={() => buttonPressed('A_Pressed', 200)}
	on:B={() => buttonPressed('B_Pressed', 300)}
	on:LB={() => buttonPressed('LB_Pressed', 100)}
	on:RB={() => buttonPressed('RB_Pressed', 100)}
	on:X={() => buttonPressed('X_Pressed', 100)}
	on:Y={() => buttonPressed('Y_Pressed', 400)}
	on:DPadUp={() => buttonPressed('DPadUp_Pressed', 100)}
	on:DPadDown={() => buttonPressed('DPadDown_Pressed', 100)}
	on:LeftStick={LeftStick}
	on:RightStick={RightStick}

/>

<style lang="scss">
</style>
