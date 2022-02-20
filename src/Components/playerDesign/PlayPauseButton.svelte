<script lang="ts">
    import FaPlay from 'svelte-icons/fa/FaPlay.svelte'
    import FaPause from 'svelte-icons/fa/FaPause.svelte'

    export let isPaused: boolean;
    export let showGamepadButtons: boolean = false;
    export let showKeyboardButtons: boolean = false;
</script>

<button on:click class:hardware={showGamepadButtons || showKeyboardButtons}>
        <!-- icons from https://thoseawesomeguys.com/prompts/ -->
        {#if showGamepadButtons}
            <img class="key-hint-icon" src="/buttons/xbox/XboxSeriesX_A.png" alt="Play/Pause via A Button">
        {:else if showKeyboardButtons}
            <img class="key-hint-icon" src="/buttons/keyboard/Space_Key_Light.png" alt="Play/Pause via space Button">
        {:else}
            <span class="icon">
                {#if isPaused}
                    <FaPlay/>
                {:else}
                    <FaPause/>
                {/if}
            </span>
        {/if}
</button>

<style lang="scss">
	button {
		--button-size: 32px;

		-webkit-box-align: center;
		-webkit-box-pack: center;
		align-items: center;
		background-color: #fff;
		border: none;
		border-radius: var(--button-size);
		color: #000;
		display: flex;
		height: var(--button-size);
		justify-content: center;
		min-width: var(--button-size);
		position: relative;
		transition: none 33ms cubic-bezier(0.3, 0, 0.7, 1);
		transition-property: none;
		transition-property: all;
		width: var(--button-size);
        touch-action: manipulation;

        &.hardware {
            background-color: transparent !important;
        }

        &:hover {
            transform: scale(1.06);
            transition: none 33ms cubic-bezier(.3,0,0,1);
                transition-property: none;
            transition-property: all;
        }

        & .icon {
            color: #000;
            width: 16px;
            height: 16px;
            margin-left: 2px;
        }
        & img.key-hint-icon {
            width: 32px;
            height: 32px;
        }
	}
</style>
