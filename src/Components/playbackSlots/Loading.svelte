<script lang="ts">
    import FaSpinner from 'svelte-icons/fa/FaSpinner.svelte'
</script>

<div class="spinner">
    <FaSpinner />
</div>

<style lang="scss">
    @keyframes rotate{
        from{ transform: rotate(-360deg); }
        to{ transform: rotate(360deg); }
    }

    div.spinner {
        width: 28px;
        height: 28px;
        color: #fff;
        margin: 5px;

        animation-name: rotate;
        animation-duration: 5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
</style>