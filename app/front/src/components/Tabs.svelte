<script>
    export let tabs = [];
    export let activeTabId = 0;

    const handleClick = tabId => () => (activeTabId = tabId);
</script>



<ul>
{#each tabs as tab}
    <li class={activeTabId === tab.id ? 'active' : ''}>
        <span on:click={handleClick(tab.id)}>{tab.label}</span>
    </li>
{/each}
</ul>
{#each tabs as tab}
    {#if activeTabId == tab.id}
        <svelte:component this={tab.component}/>
    {/if}
{/each}



<style>

    ul {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        padding: 0;
        margin: 0;
        list-style: none;
        border-bottom: 1px solid var(--color-base-secondary);
    }

    li {
        margin-bottom: -1px;
    }

    span {
        display: block;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    span:hover {
        color: white;
        border-bottom: 1px solid var(--color-brand-primary);
    }

    li.active > span {
        color: white;
        border-bottom: 1px solid var(--color-brand-primary);
    }

</style>