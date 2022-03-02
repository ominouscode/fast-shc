<script>
    import Icon from '../gui/Icon.svelte';

    import {fly} from 'svelte/transition';
    import {pageList} from '../../utils/pageList' 
    import {currentPageId} from '../../stores.js';
</script>

<!-- Side Navigation Panel -->
<nav in:fly={{x:-200}}>
    <ul>
        <div class="logo">
            Controller
        </div>
        {#each pageList as page}
        <li on:click="{() => {$currentPageId = page.id}}" class:active={$currentPageId == page.id}>
            <div class="icon"><Icon id={page.icon} /></div><span>{page.label}</span>
        </li>
        {/each}
    </ul>
</nav>


<style>
    nav {
        width: 215px;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
    ul {
        padding: 4.5em 0 0 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
    li {
        display: flex;
        padding: 0.75em 0;
        margin-right: 1em;
        border-left: 3px solid transparent;
        fill: rgba(var(--color-text-secondary), 1);
        cursor: pointer;
    }

    li:hover {
        border-left: 2px solid rgba(var(--color-brand-primary), 1);
        background-color: rgba(var(--color-base-secondary), 1);
        border-top-right-radius: 0.4em;
        border-bottom-right-radius: 0.4em;
    }

    .logo {
        padding: 0;
        margin-bottom: 1em;
        display: flex;
        justify-content: center;
        align-content: center;
        color: rgba(var(--color-text-primary), 1);
        font-weight: 900;
        text-transform: uppercase;
    }

    .active {
        color: rgba(var(--color-brand-primary), 1);
        fill: rgba(var(--color-brand-primary), 1);
        border-left: 2px solid rgba(var(--color-brand-primary), 1);
        background-color: rgba(var(--color-base-secondary), 1);
        border-top-right-radius: 0.4em;
        border-bottom-right-radius: 0.4em;
        cursor: unset;
    }

    .icon {
        margin: 0.1em 1.25em 0 1.25em;
        height: 16px;
        width: 16px;
    }

    @media (max-width: 600px) {
        nav {
            background-color: rgba(var(--color-bg), 1);
        }
    }

    @media (min-width: 600px) {
        .logo {
            display: none;
        }
    }
</style>