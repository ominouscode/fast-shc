<script>
    import { sidenavOpen } from '../../stores.js';

	import Header from '../layout/Header.svelte';
	import Sidenav from '../layout/Sidenav.svelte';
</script>

<Header />
<div class="content" class:compressed={$sidenavOpen}>
    <slot></slot>
</div>
{#if $sidenavOpen}
<Sidenav />
{/if}

<style>
    .content {
		display: flex;
		justify-content: center;
		padding: 0 1.5em 0 1.5em;
	}

    .compressed {
        margin-left: 200px;
    }

    @media (max-width: 600px) {
		.content {
			padding: 0;
		}

        .compressed {
            margin-left: 0;
        }
    }
</style>