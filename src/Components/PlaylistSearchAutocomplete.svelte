<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import AutoComplete from 'simple-svelte-autocomplete';

	export let placeholder: string;
	export let items: SpotifyApi.PlaylistObjectSimplified[];
	export let searchFunction: (keywords?: { filtered?: string, unfiltered?: string}) => Promise<SpotifyApi.PlaylistObjectSimplified[]>;
	export let selectedItem: SpotifyApi.PlaylistObjectSimplified;

	const dispatch = createEventDispatcher();
</script>

<AutoComplete
	{items}
	{searchFunction}
	bind:selectedItem
	onChange={(details) => dispatch('change',details)}
	onFocus={dispatch('focus')}
	onBlur={dispatch('blur')}

	keywordsFunction={(keyword) => {return keyword}}
	inputClassName="spotify-styled-input"
	placeholder={placeholder}
	delay="200"
	localFiltering={false}
	labelFieldName="name"
	valueFieldName="id"
	create={false}
	hideArrow={true}
	noResultsText="No playlist found"
>
	<div slot="item" let:item let:label>
		<div class="search-result">
			<img src={item.images[0].url} alt="Cover image of playlist {item.name}" />
			<div class="result-text">
				<p class="name">{item.name}</p>
				<p class="owner">By {item.owner.display_name}</p>
			</div>
		</div>
	</div>
</AutoComplete>

<style lang="scss">
	:global(.autocomplete) {
		margin: 10px !important;
		// max-width: 364px !important;
		max-width: 275px !important;
	}

	:global(.autocomplete-list) {
		max-width: 275px;
		border: 0;
		background-color: var(--background-base, #121212) !important;
		border-color: var(--text-bright-accent) !important;
		border-width: 0px 2px 2px 2px !important;
	}

	:global(.autocomplete-list-item.selected) {
		background-color: #282828 !important;
	}

	:global(input.autocomplete-input.spotify-styled-input) {
		border: 0;
		border-radius: 500px;
		color: #000;
		padding: 11px 30px 6px 30px !important;
		text-overflow: ellipsis;
	}

	:global(.autocomplete:not(.hide-arrow):not(.is-loading)::after) {
		border-color: #000 !important;
	}

	.search-result {
		display: flex;
		flex-direction: row;
		align-items: center;

		& > img {
			width: 56px;
			height: 56px;
		}

		& .result-text {
			margin-left: 10px;

			& .name {
				color: var(--text-base, #fff);
			}

			& .owner {
				color: var(--text-subdued, #a7a7a7);
			}
		}
	}
</style>
