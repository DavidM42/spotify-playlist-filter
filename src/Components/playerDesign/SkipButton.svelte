<script lang="ts">
    import FaStepForward from 'svelte-icons/fa/FaStepForward.svelte';
    import FaStepBackward from 'svelte-icons/fa/FaStepBackward.svelte';
    import FaFastForward from 'svelte-icons/fa/FaFastForward.svelte';
    import IoMdHeart from 'svelte-icons/io/IoMdHeart.svelte'
    // import IoMdAddCircleOutline from 'svelte-icons/io/IoMdAddCircleOutline.svelte'

    export let mode: 'FORWARD' | 'BACKWARD' | 'FAST-FORWARD' | 'ADD';
    export let showGamepadButtons: boolean = false;
    export let showKeyboardButtons: boolean = false;
</script>

<button on:click>
    <!-- icons from https://thoseawesomeguys.com/prompts/ -->
    {#if showGamepadButtons}
        {#if mode === 'FORWARD'}
            <img class="key-hint-icon left-margin" src="/buttons/xbox/XboxSeriesX_RB.png" alt="Forward via RB Button">
        {:else if mode === 'BACKWARD'}
            <img class="key-hint-icon right-margin" src="/buttons/xbox/XboxSeriesX_LB.png" alt="Backward via LB Button">
        {:else if mode === 'FAST-FORWARD'}
            <img class="key-hint-icon left-margin" src="/buttons/xbox/XboxSeriesX_X.png" alt="Fast-Forward via X Button">
        {:else if mode === 'ADD'}
        <img class="key-hint-icon right-margin" src="/buttons/xbox/XboxSeriesX_Y.png" alt="Add to playlist via Y Button">
        {/if}
    {:else if showKeyboardButtons}
        {#if mode === 'FORWARD'}
            <img class="key-hint-icon left-margin" src="/buttons/keyboard/D_Key_Light.png" alt="Forward via D Button">
        {:else if mode === 'BACKWARD'}
            <img class="key-hint-icon right-margin" src="/buttons/keyboard/A_Key_Light.png" alt="Backward via A Button">
        {:else if mode === 'FAST-FORWARD'}
            <img class="key-hint-icon left-margin" src="/buttons/keyboard/Ctrl_Key_Light.png" alt="Fast-Forward via control key">
        {:else if mode === 'ADD'}
        <img class="key-hint-icon right-margin" src="/buttons/keyboard/Enter_Key_Light.png" alt="Add to playlist via Enter key">
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

        & .icon {
            color: #b3b3b3;
            width: 16px;
            height: 16px;
            margin-left: 2px;

            &:hover {
                color: #fff;
            }
        }

        & img.key-hint-icon {
            width: 32px;
            height: 32px;

            &.left-margin {
                margin-left: 15px;
            }

            &.right-margin {
                margin-right: 15px;
            }

            &:hover {
                transform: scale(1.2);
                transition: none 33ms cubic-bezier(.3,0,0,1);
                transition-property: none;
                transition-property: all;
            }
        }
	}
</style>
