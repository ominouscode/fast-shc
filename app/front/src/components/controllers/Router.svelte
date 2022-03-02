<script>
    import { pageList } from '../../utils/pageList'
    import { token, currentPageId } from '../../stores.js';

    import Layout from '../layout/Layout.svelte';
    import Login from '../../pages/auth/Login.svelte';
</script>


{#if $token}
    <Layout>
        {#each pageList as page}
            {#if $currentPageId == page.id}
                <svelte:component this={page.component} />
            {/if}
        {/each}
    </Layout>
{:else}
    <Login />
{/if}