<script lang="ts">
    export let title: string;
    export let artist: string;
    export let imageUrl: string;
</script>

<div class="info-wrapper">
    <div class="image-wrapper">
        <img class="image" src="{imageUrl}" alt="{artist} cover art">
    </div>
    <div class="text-wrapper">
        <span class="title">{title || ''}</span>
        <span class="album">{artist || ''}</span>
    </div>
</div>


<style lang="scss">
    .info-wrapper {
        display: flex;

        & .text-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 10px;
        }
    }

    .image {
        width: 56px;
        height: 56px;
    }

    .title {
        color: #fff;
        font-size: 0.875rem;
        line-height: 1rem;
        text-transform: none;
        letter-spacing: normal;
    }

    .album {
        color: #b3b3b3;

        font-size: 0.6875rem;
        line-height: 1rem;
        text-transform: none;
        letter-spacing: normal;
    }

</style>