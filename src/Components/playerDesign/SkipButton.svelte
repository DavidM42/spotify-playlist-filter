<script lang="ts">
    import FaStepForward from 'svelte-icons/fa/FaStepForward.svelte';
    import FaStepBackward from 'svelte-icons/fa/FaStepBackward.svelte';
    import FaFastForward from 'svelte-icons/fa/FaFastForward.svelte';
    import IoMdHeart from 'svelte-icons/io/IoMdHeart.svelte'
    import MdContentCut from 'svelte-icons/md/MdContentCut.svelte'
    // import IoMdAddCircleOutline from 'svelte-icons/io/IoMdAddCircleOutline.svelte'

    /**
     * Which button ui should show. Which function it serves basically
     */
    export let mode: 'FORWARD' | 'BACKWARD' | 'FAST-FORWARD' | 'ADD' | 'AUTO-FAST-FORWARD-TOGGLE';
    
    /**
     * If gamepad button mapping should be shown instead of icons.
     */
    export let showGamepadButtons: boolean = false;

    /**
     * If keyboard keys mapping should be shown instead of icons
     */
    export let showKeyboardButtons: boolean = false;
    
    /**
     * If button should be colored to show being active
     */
    export let activated: boolean = false;

    /**
     * Translates modes into user-friendly texts for titles of buttons
     */
    function modeExplanation() {
        switch (mode) {
            case 'FORWARD':
                return 'Skip forward to next track';
            case 'BACKWARD':
                return 'Skip back to last track';
            case 'FAST-FORWARD':
                return 'Skip quarter of track length forward';
            case 'ADD':
                return 'Add to your target playlist';
            case 'AUTO-FAST-FORWARD-TOGGLE':
                return 'Toggle auto fast forwarding mode that skips first and last quarter of track';
            default:
                return '';
        }
    }
</script>

<button 
    on:click
    title={modeExplanation()}
    class:activated={activated}
    class:hinting={showKeyboardButtons || showGamepadButtons}
    >
    <!-- icons from https://thoseawesomeguys.com/prompts/ -->
    {#if showGamepadButtons}
        {#if mode === 'FORWARD'}
            <img class="key-hint-icon" src="/buttons/xbox/XboxSeriesX_RB.png" alt="Forward via RB Button">
        {:else if mode === 'BACKWARD'}
            <img class="key-hint-icon" src="/buttons/xbox/XboxSeriesX_LB.png" alt="Backward via LB Button">
        {:else if mode === 'FAST-FORWARD'}
            <img class="key-hint-icon" src="/buttons/xbox/XboxSeriesX_X.png" alt="Fast-Forward via X Button">
        {:else if mode === 'ADD'}
            <img class="key-hint-icon" src="/buttons/xbox/XboxSeriesX_Y.png" alt="Add to playlist via Y Button">
        {:else if mode === 'AUTO-FAST-FORWARD-TOGGLE'}
            <img class="key-hint-icon" src="/buttons/xbox/XboxSeriesX_B.png" alt="Add to playlist via B Button">
        {/if}
    {:else if showKeyboardButtons}
        {#if mode === 'FORWARD'}
            <img class="key-hint-icon" src="/buttons/keyboard/D_Key_Light.png" alt="Forward via D key">
        {:else if mode === 'BACKWARD'}
            <img class="key-hint-icon" src="/buttons/keyboard/A_Key_Light.png" alt="Backward via A key">
        {:else if mode === 'FAST-FORWARD'}
            <img class="key-hint-icon" src="/buttons/keyboard/Ctrl_Key_Light.png" alt="Fast-Forward via control key">
        {:else if mode === 'ADD'}
            <img class="key-hint-icon" src="/buttons/keyboard/Enter_Key_Light.png" alt="Add to playlist via Enter key">
        {:else if mode === 'AUTO-FAST-FORWARD-TOGGLE'}
            <img class="key-hint-icon" src="/buttons/keyboard/S_Key_Light.png" alt="Toggle auto skipping via S key">
        {/if}
    {:else}
        <span class="icon">
            {#if mode === 'FORWARD'}
                <FaStepForward/>
            {:else if mode === 'BACKWARD'}
                <FaStepBackward/>
            {:else if mode === 'FAST-FORWARD'}
                <FaFastForward/>
            {:else if mode === 'ADD'}
                <IoMdHeart/>
            {:else if mode === 'AUTO-FAST-FORWARD-TOGGLE'}
                <MdContentCut/>
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
        background: transparent;
        border: none;
        color: #b3b3b3;
        display: flex;
        height: var(--button-size);
        justify-content: center;
        min-width: var(--button-size);
        position: relative;
        width: var(--button-size);

        // space between buttons
        margin: 0px 4px;

        &.activated {
            // special colored button acting as toggle feedback

            &.hinting {
                // if hints for keyboard or gamepad are enabled then background + border hint
                background-color: var(--background-elevated-highlight, #2a2a2a);
                border-radius: 50%;
                border: 1px solid var(--text-bright-accent, #1ed760);
            }

            & .icon {
                // on normal icons just color icon
                color: var(--text-bright-accent, #1ed760);
            }
        }

        & .icon {
            // normal icon color
            color: #b3b3b3;

            width: 16px;
            height: 16px;

            &:hover {
                color: #fff;
            }
        }

        & img.key-hint-icon {
            width: 32px;
            height: 32px;

            &:hover {
                transform: scale(1.2);
                transition: none 33ms cubic-bezier(.3,0,0,1);
                transition-property: none;
                transition-property: all;
            }
        }
	}
</style>
