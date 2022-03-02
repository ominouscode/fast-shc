<script>
    import DropdownButton from '../gui/buttons/DropdownButton.svelte';
    import IconButton from '../gui/buttons/IconButton.svelte';
    import {sidenavOpen} from '../../stores.js';
</script>

<!-- Top Navigation Bar -->
<nav>
    <ul>
        <li class="logo">
            Controller
        </li>
        <li class="enclosed">
            <IconButton id="bars" size="sm" on:click={() => {$sidenavOpen = !$sidenavOpen}} />
        </li>
        <li>
            <IconButton id="question" />
        </li>
        <li>
            <IconButton id="bell" />
        </li>
        <li>
            <DropdownButton>Omen</DropdownButton>
        </li>
    </ul>
</nav>


<style>
    nav {
        height: 3em;
        position: relative;
        margin-bottom: 1.5em;
        padding-right: 1.5em;
        border-bottom: 1px solid rgba(var(--color-base-secondary), 1);
        z-index: 2;
    }

    ul {
        height: 100%;
        list-style: none;
        display: flex;
        justify-content: flex-end;
        gap: 1em;
        padding: 0;
        margin: 0;
    }

    li {
        display: flex;
        align-items: center;
    }

    .logo {
        padding: 0.2em 1em 0 1.55em;
        color: rgba(var(--color-text-primary), 1);
        font-weight: 900;
        text-transform: uppercase;
    }

    .enclosed {
        margin-right: auto;
        padding-left: 1.5em;
        padding-right: 1.5em;
        border-left: 1px solid rgba(var(--color-base-secondary), 1);
        border-right: 1px solid rgba(var(--color-base-secondary), 1);
    }

    @media (max-width: 600px) {
        .logo {
            display: none;
        }
    }
</style>